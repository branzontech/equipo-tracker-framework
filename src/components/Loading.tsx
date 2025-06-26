import { ClipLoader } from "react-spinners";

function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-white/60 backdrop-blur-sm">
      <ClipLoader color="#2563eb" size={50} />
    </div>
  );
}

export default Loading;