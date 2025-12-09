import LocationSelector from "../LocationSelector";

export const PostDetails = ({
  caption,
  setCaption,
  schoolName,
  setSchoolName,
  selectedArea,
  setSelectedArea,
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold mb-4">Post Details</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Caption
          </label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            rows="3"
            placeholder="Tell us about these products..."
            required
          />
        </div>

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
