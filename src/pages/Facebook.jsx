import { useEffect } from "react";

export default function FacebookPage() {
  useEffect(() => {
    // FB SDK Load
    if (!window.FB) {
      const script = document.createElement("script");
      script.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v17.0";
      script.async = true;
      document.body.appendChild(script);
    } else {
      window.FB.XFBML.parse();
    }
  }, []);

  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <div
        className="fb-page"
        data-href="https://www.facebook.com/jaiswalsanjaybjp" 
        data-tabs="timeline"
        data-width="1200"
        data-height="700"
        data-hide-cover="false"
        data-show-facepile="true"
      >
      </div>
    </div>
  );
}
