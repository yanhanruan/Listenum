import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

type Props = {
  value: string;
  onChange: (val: string) => void;
  onCheck: () => void;
};

export default function NumberInput({ value, onChange, onCheck }: Props) {
  return (
    <div>
      <h2 className="text-4xl font-bold mb-6 text-[#141414]">4, 7, 2, 9, 1, 6</h2>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Type the number here"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="pl-10 bg-[#f2f2f2] border-0"
          />
        </div>
        <Button className="bg-[#789978] hover:bg-[#779977] text-white px-6" onClick={onCheck}>
          Check
        </Button>
      </div>
    </div>
  );
}
