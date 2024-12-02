import { QueryData, useQueryInteraction } from "@/hooks/useQueryInteraction";
import { Separator } from "./ui/separator";
import { layerNameFromLayerId } from "@/lib/capas";
import { Button } from "./ui/button";
import { XIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { useEffect, useState } from "react";

/** Toma un valor del JSON y devuelve el JSX adecuado a renderizar. */
function DataValue({ value }: { value: unknown }) {
  if (value === null || value === undefined) {
    return <span className="text-gray-400">null</span>;
  }

  if (value instanceof Object) {
    return JSON.stringify(value);
  }

  return value.toString();
}

function QueryDataTable({ queryData }: { queryData: QueryData }) {
  if (!queryData.features || queryData.features.length === 0) {
    return;
  }

  const propertiesArray = queryData.features.map((f) => f.properties);
  const propertiesKeys = Object.keys(propertiesArray[0]);

  return (
    <div className="overflow-y-auto max-h-[45vh] pl-2 w-full">
      <Table className="w-full mb-2">
        <TableHeader>
          <TableRow>
            {propertiesKeys.map((key, idx) => (
              <TableHead key={idx}>{key}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {propertiesArray.map((properties, idx) => (
            <TableRow key={idx}>
              {Object.entries(properties).map(([key, value]) => (
                <TableCell key={key} className="font-medium whitespace-nowrap">
                  <DataValue value={value} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default function QueryDataMenu() {
  const { queryData } = useQueryInteraction();
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (queryData) {
      setIsExpanded(true);
    }
  }, [queryData]);

  const title = queryData
    ? layerNameFromLayerId(queryData.layer)
    : "Capa vectorial";

  return (
    <div
      className={`absolute bottom-0 w-full bg-sidebar duration-300 ease-in-out ${
        isExpanded ? "" : "hidden"
      }`}
    >
      <div className="flex justify-between my-1 mx-2">
        <p className="font-semibold">{title}</p>
        <Button
          variant="ghost"
          className="h-6 w-8"
          onClick={() => setIsExpanded(false)}
        >
          <XIcon />
        </Button>
      </div>

      <Separator className="bg-sidebar-border w-auto" />

      {queryData && <QueryDataTable queryData={queryData} />}
    </div>
  );
}
