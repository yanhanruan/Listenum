import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Calendar, Phone } from "lucide-react";

type Props = {
  value: string;
  onChange: (val: string) => void;
};

export default function TabsSelector({ value, onChange }: Props) {
  return (
    <Tabs value={value} onValueChange={onChange} className="w-fit mb-8">
      <TabsList className="bg-[#e5e8eb]/30">
        <TabsTrigger value="number" className="gap-2">
          <MapPin className="w-4 h-4" /> Number
        </TabsTrigger>
        <TabsTrigger value="date" className="gap-2">
          <Calendar className="w-4 h-4" /> Date
        </TabsTrigger>
        <TabsTrigger value="phone" className="gap-2">
          <Phone className="w-4 h-4" /> Phone
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
