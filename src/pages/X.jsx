import { useEffect } from "react";

export default function Xpage() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://platform.twitter.com/widgets.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div style={{ 
      width: "100%", 
      display: "flex", 
      justifyContent: "center" 
    }}>
      <blockquote className="twitter-tweet">
        <p lang="en" dir="ltr">
          <a href="https://twitter.com/sanjayjaiswalMP?ref_src=twsrc%5Etfw">
            Tweets by @sanjayjaiswalMP
          </a>
        </p>
      </blockquote>
    </div>
  );
}