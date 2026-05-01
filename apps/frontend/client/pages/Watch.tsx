import { useParams } from "react-router-dom";

export default function Watch() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-4xl font-bold mb-6">
        Watching Video #{id}
      </h1>

      <video
        controls
        autoPlay
        className="w-full max-w-4xl rounded-lg"
      >
        <source
          src="https://www.w3schools.com/html/mov_bbb.mp4"
          type="video/mp4"
        />
      </video>
    </div>
  );
}