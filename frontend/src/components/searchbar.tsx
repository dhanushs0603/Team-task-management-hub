
interface Props { value: string;
    onChange: (value: string) => void;
    }
    const SearchBar = ({ value, onChange }: Props) => { return (
    <input type="text" placeholder="Search task..." value={value} onChange={(e) => onChange(e.target.value)}/>
    );
    };
    export default SearchBar;