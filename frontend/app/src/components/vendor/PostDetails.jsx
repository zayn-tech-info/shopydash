import LocationSelector from "../LocationSelector";

export const PostDetails = ({
  schoolName,
  setSchoolName,
  selectedArea,
  setSelectedArea,
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold mb-4">Post Details</h2>
      <div className="space-y-4">
        <LocationSelector
          schoolName={schoolName}
          setSchoolName={setSchoolName}
          selectedArea={selectedArea}
          setSelectedArea={setSelectedArea}
        />
      </div>
    </div>
  );
};
