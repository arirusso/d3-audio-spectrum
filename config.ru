require "rack"
require "rack/static"
require "net/http"
require "uri"

@root = File.dirname(__FILE__)

DIRECTORIES = %w{/css /images /js /lib /media}.freeze
PAGES = %w{/index.html}.freeze

use Rack::Static, :urls => DIRECTORIES, :root => "#{@root}/public"

def relay_audio(request)
  audio_url = request.params["src"]
  uri = URI.parse(audio_url)
  http = Net::HTTP.new(uri.host, uri.port)
  if audio_url =~ /^https/
    http.use_ssl = true
    http.verify_mode = OpenSSL::SSL::VERIFY_NONE
  end
  request = Net::HTTP::Get.new(uri.request_uri)
  http.request(request)
end

def not_found
  [404, {"Content-Type" => "text/html"}, ["not found"]]
end

def render_audio(env)
  request = Rack::Request.new(env)
  if request.params["src"].nil?
    not_found
  else
    response = relay_audio(request)
    if response.code == "200" && (type = response["content-type"]) =~ /^audio\//
      [200, {"Content-Type" => type}, [response.body]]
    else
      not_found
    end
  end
end

def render_page(path)
  file = path.scan(/\/(\w+)\.html/)[0][0]
  [
    200,
    {
      "Content-Type"  => "text/html",
      "Cache-Control" => "public, max-age=1"
    },
    File.open("#{@root}/public/#{file}.html", File::RDONLY)
  ]
end

app = Proc.new do |env|
  path = Rack::Utils.unescape(env["PATH_INFO"])
  path = PAGES.first if path == "/"
  if path == "/audio"
    render_audio(env)
  elsif PAGES.include?(path)
    render_page(path)
  else
    not_found
  end
end

run(app)
