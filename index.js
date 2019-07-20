var index_page = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
</head>
<body>
<div class="jumbotron text-center">
  <h1>Lil Link</h1>
  <p>Create a new shortlink here</p>
</div>
<div class="container">
  <div class="row">
  <div class="col-md-12 text-center pt-4">
    <form action="/" method="post">
        <label for="shortlink">Name:</label>
        <input name="shortlink" id="shortlink" value="shortlink" class="form-control input-lg">
  </div>
  </div>
  <div class="row">
  <div class="col-md-12 text-center pt-4">
      <label for="url">Destination URL:</label>
      <input name="url" id="url" value="https://example.com" class="form-control input-lg">
  </div>
  </div>
  <div class="row">
  <div class="col-md-12 text-center pt-4 pb-5">
    <button class="btn btn-secondary btn-lg btn-block">Create Link</button>
  </div>
  </div>
  </form>
</div>
  $ADBANNER
</body>
</html>
`;

var ad_banner = `
<a style="display:block" href="https://get.lillink.co">
  <div class="jumbotron text-center border">
    <h1>Get shortlinks for your organzation!</h1>
    <h2>Your very own internal branded shortlinks</h2>
  </div>
</a>
`;

var no_ad_banner = `
  <div class="jumbotron text-center border">
  </div>
</a>
`;

var created = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
</head>
<body>
<div class="jumbotron text-center">
  <h1>Lil Link</h1>
</div>
<div class="container">
  <div class="row pt-4">
  <div class="col-md-12 text-center">
    Your shortlink <a href="$SHORTLINK">$SHORTLINK</a> has been created pointing to <a href="$URL">$URL</a>.
  </div>
  </div>
</div>
</body>
</html>
`;

var already_exists = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
</head>
<body>
<div class="jumbotron text-center">
  <h1>Lil Link</h1>
</div>
<div class="container">
  <div class="row">
  <div class="col-md-12 text-center pt-4">
    I'm sorry, the shortlink <a href="$SHORTLINK">$SHORTLINK</a> already exists.
  </div>
  </div>
</div>
</body>
</html>
`;

var doesnt_exist = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
</head>
<body>
<div class="jumbotron text-center">
  <h1>Lil Link</h1>
</div>
<div class="container">
  <div class="row">
  <div class="col-md-12 text-center pt-4">
    I'm sorry, that shortlink doesn't exist. <a href="/">Create it now!</a>
  </div>
  </div>
</div>
</body>
</html>
`;

/**
 * rawHtmlResponse delievers a response with HTML inputted directly
 * into the worker script
 * @param {string} html
 */
async function rawHtmlResponse(html) {
  const init = {
    headers: {
      "content-type": "text/html;charset=UTF-8"
    }
  };

  return new Response(html, init);
}

//intercepts HTTP requests and cals functions based on if request is POST or GET
addEventListener("fetch", event => {
  const { request } = event;
  const { url } = request;
  if (request.method === "POST") {
    return event.respondWith(handlePostRequest(request));
  } else if (request.method === "GET") {
    //return event.resondWith(handleGetRequest(requet));
    return event.respondWith(handleGetRequest(request));
  }
});

async function handleGetRequest(request) {
  const url = request.url;
  var removeHttp = url.slice(url.indexOf("//") + 2); //removes everything before the doubleslash, e.g. http://
  var afterSlash = removeHttp.slice(removeHttp.indexOf("/") + 1); //removes everything before the slash
  if (afterSlash === "") {
    //if there's nothing after the slash, reurn the create shortlink form
    if (request.url.includes('//lillink.co')) {
      index_page = index_page.replace(/\$ADBANNER/g, ad_banner)
      return rawHtmlResponse(index_page);
    } else {
      index_page = index_page.replace(/\$ADBANNER/g, no_ad_banner)
      return rawHtmlResponse(index_page);
    }  
  } else if (afterSlash === "admin") {
      return new Response("admin stub area"); //stub out /admin for future usage so early deployments can't reserve that.
  } else if (afterSlash.startsWith("admin/")) {
      return new Response("admin stub area"); //stub out /admin for future usage so early deployments can't reserve that.
  }
    else{
    return handleRedirect(afterSlash);
  }
}

async function handleRedirect(shortlink) {
  const getCache = () => SHORTLINKS.get(shortlink);
  const url = await getCache();
  if (url === null) {
    doesnt_exist = doesnt_exist.replace(/\$SHORTLINK/g, shortlink);
    return rawHtmlResponse(doesnt_exist);
  } else {
    const getHits = () => HITS.get(shortlink);
    const hits = await getHits();
    await HITS.put(shortlink, Number(hits) + 1);
    return Response.redirect(url, 302);
  }
}

//Function to take JSON POST request and return JSON as a string with HTTP Code 200
async function handlePostRequest(request) {
  const body = await request.formData();
  var shortlink = body.get("shortlink");
  var url = body.get("url");
  const getCache = () => SHORTLINKS.get(shortlink);
  const url2 = await getCache();
  if (url2 === null) {
    if (url.startsWith("http://")) {
    } else if (url.startsWith("https://")) {
    } else {
      url = "http://" + url;
    }
    await SHORTLINKS.put(shortlink, url);
    await HITS.put(shortlink, 0);
    full_shortlink_url = request.url + shortlink
    created = created.replace(/\$SHORTLINK/g, full_shortlink_url)
    created = created.replace(/\$URL/g, url)
    return rawHtmlResponse(created);
  } else {
    already_exists = already_exists.replace(/\$SHORTLINK/g, request.url + shortlink);
    return rawHtmlResponse(already_exists);
  }
}
