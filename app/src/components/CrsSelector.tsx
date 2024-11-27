import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMap } from "@/hooks/useMap";
import { CRS } from "@/models";

export default function CrsSelector() {
  const { crs, setCRS } = useMap();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{crs}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>SRC Actual</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={crs} onValueChange={setCRS}>
          <DropdownMenuRadioItem defaultChecked value={CRS.EPSG_4326}>
            EPSG:4326 - WGS 84
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value={CRS.EPSG_22175}>
            EPSG:22175
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
