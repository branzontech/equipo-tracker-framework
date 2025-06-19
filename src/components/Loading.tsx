import { ClipLoader } from "react-spinners";

function Loading() {
  return (
    <div className="flex justify-center items-center py-10">
      <ClipLoader color="#2563eb" size={50} />
    </div>
  );
}

export default Loading;