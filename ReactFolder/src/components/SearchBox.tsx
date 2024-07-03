interface SearchBoxProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}
const SearchBox = ({ searchQuery, setSearchQuery }: SearchBoxProps) => {
  return (
    <div className="searchBox bg-gradient text-white">
      <label htmlFor="searchBoxForm" className="form-label">
        &#127936; Search for Videos &#127936;
      </label>
      <input
        type="email"
        className="form-control"
        id="searchBoxForm"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      ></input>
    </div>
  );
};

export default SearchBox;
