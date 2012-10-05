require "net/http"
require "uri"

# This is the root of our app
@root = File.expand_path(File.dirname(__FILE__))

use Rack::Static, :urls => ["/media"]
run Proc.new { |env|
  request = Rack::Request.new(env)
  path = Rack::Utils.unescape(env['PATH_INFO'])
  index_file = @root + "#{path}/index.html"
  audio_url = request.params["src"]
  if path == "/audio" && !audio_url.nil? && !audio_url.size.zero?
    uri = URI.parse(audio_url)
    http = Net::HTTP.new(uri.host, uri.port)
    if audio_url =~ /^https/
      http.use_ssl = true
      http.verify_mode = OpenSSL::SSL::VERIFY_NONE
    end
    request = Net::HTTP::Get.new(uri.request_uri)
    response = http.request(request)
    if response.code == "200" && (type = response["content-type"]) =~ /^audio\//
      [200, {"Content-Type" => type}, [response.body]]
    else
      [404, {'Content-Type' => 'text/html'}, ["not found"]]
    end
  elsif File.exists?(index_file)
    # Return the index
    [200, {'Content-Type' => 'text/html'}, [File.read(index_file)]]
  else
    # Pass the request to the directory app
    Rack::Directory.new(@root).call(env)
  end
}
