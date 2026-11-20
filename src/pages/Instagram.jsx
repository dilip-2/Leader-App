export default function InstagramPage() {
  return (
    <div style={{ width: "100%", height: "80vh" }}>
      <iframe
        src="https://www.instagram.com/drsanjayjaiswalbjp/embed/"
        style={{
          border: "none",
          width: "100%",
          height: "100%",
        }}
        allowFullScreen={true}
        loading="lazy"
      ></iframe>
    </div>
  );
}
