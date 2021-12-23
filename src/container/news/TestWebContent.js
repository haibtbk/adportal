const url = `<!doctype html>
<html lang="en" prefix="op: http://media.facebook.com/op#">
  <head>
    <meta charset="utf-8">
    <link rel="canonical" href="http://example.com/article.html">
    <meta property="op:markup_version" content="v1.0">
  </head>
  <body>
    <article>
      <header>
        <!-- The title and subtitle shown in your Instant Article -->
        <h1>Article Title</h1>
        <h2>Article Subtitle</h2>

        <!-- The date and time when your article was originally published -->
        <time class="op-published" datetime="2014-11-11T04:44:16Z">November 11th, 4:44 PM</time>

        <!-- The date and time when your article was last updated -->
        <time class="op-modified" dateTime="2014-12-11T04:44:16Z">December 11th, 4:44 PM</time>

        <!-- The authors of your article -->
        <address>
          <a rel="facebook" href="http://facebook.com/brandon.diamond">Brandon Diamond</a>
          Brandon is an avid zombie hunter.
        </address>
        <address>
          <a>TR Vishwanath</a>
          Vish is a scholar and a gentleman.
        </address>

        <!-- The cover image shown inside your article --> 
        <figure>
          <img src="https://hanoimoi.com.vn/Uploads/Album/20180408/d88b0f45-94b1-4717-b08c-72e9abcae0df.jpg" />
          <figcaption>This image is amazing</figcaption>
        </figure>   

        <!-- A kicker for your article --> 
        <h3 class="op-kicker">
          This is a kicker
        </h3>

      </header>

      <!-- Article body goes here -->

      <!-- Body text for your article -->
      <p> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. </p> 

      <!-- A video within your article -->
      <figure>
        <video>
          <source src="http://mydomain.com/path/to/video.mp4" type="video/mp4" />
        </video>
      </figure>

      <!-- An ad within your article -->
      <figure class="op-ad">
        <iframe src="https://www.adserver.com/ss;adtype=banner320x50" height="60" width="320"></iframe>
      </figure>

      <!-- Analytics code for your article -->
      <figure class="op-tracker">
          <iframe src="" hidden></iframe>
      </figure>

      <footer>
        <!-- Credits for your article -->
        <aside>Acknowledgements</aside>

        <!-- Copyright details for your article -->
        <small>Legal notes</small>
      </footer>
    </article>
  </body>
</html>`
export default url