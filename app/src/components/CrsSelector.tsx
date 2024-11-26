import { CRS } from "@/models";
import { useState } from "react";

export default function CrsSelector() {
  const [crs, setCrs] = useState<CRS>(CRS.EPSG_22175);

  return (
    <>
      <h3>CRC</h3>
      <div style={{ marginBottom: "20px" }}>
        <label style={{ marginRight: "10px" }}>
          <input
            type="radio"
            name="crs"
            value={CRS.EPSG_22175}
            checked={crs === CRS.EPSG_22175}
            onChange={() => setCrs(CRS.EPSG_22175)}
          />
          EPSG:22175
        </label>
        <label>
          <input
            type="radio"
            name="crs"
            value={CRS.EPSG_4326}
            checked={crs === CRS.EPSG_4326}
            onChange={() => setCrs(CRS.EPSG_4326)}
          />
          EPSG:4326
        </label>
      </div>
    </>
  );
}
