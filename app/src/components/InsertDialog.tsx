import {
  GastronomyPlaceInputs,
  useInsertInteraction,
} from "@/hooks/useInsertInteraction";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function InsertDialog() {
  const { isOpen, closeInsert, insertNewPoint } = useInsertInteraction();
  const { toast } = useToast();

  return (
    <Dialog open={isOpen} defaultOpen>
      <DialogContent
        className="sm:max-w-[425px] [&>button]:hidden"
        onInteractOutside={closeInsert}
      >
        <DialogHeader>
          <DialogTitle>Insertar nuevo lugar gastronómico</DialogTitle>
          <DialogDescription>
            Carga los datos de un establecimiento gastronómico. Dale click a
            insertar para guardarlo en la capa vectorial.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            const data = Object.fromEntries(formData.entries());

            try {
              await insertNewPoint(data as GastronomyPlaceInputs);
              toast({
                title: "Lugar gastronómico guardado correctamente.",
                className: "bg-green-300 border-green-400",
              });
            } catch {
              toast({
                variant: "destructive",
                title: "¡Uy! Algo salió mal al intentar insertar el elemento.",
                description:
                  "Si no se guardó el lugar gastronómico, intente nuevamente.",
              });
            }

            closeInsert();
          }}
        >
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nombre" className="text-right">
                Nombre<span className="text-red-600">*</span>
              </Label>
              <Input
                id="nombre"
                name="nombre"
                className="col-span-3"
                placeholder="McDonalds"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tipo" className="text-right">
                Tipo<span className="text-red-600">*</span>
              </Label>
              <Select required name="tipo">
                <SelectTrigger id="tipo" className="col-span-3">
                  <SelectValue placeholder="Tipo de local" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Restaurante">Restaurante</SelectItem>
                  <SelectItem value="Cafetería">Cafetería</SelectItem>
                  <SelectItem value="Bar">Bar</SelectItem>
                  <SelectItem value="Take Away">Take Away</SelectItem>
                  <SelectItem value="Otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="autor" className="text-right">
                Autor
              </Label>
              <Input
                id="autor"
                name="autor"
                className="col-span-3"
                placeholder="Tu nombre"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onSubmit={closeInsert}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-slate-600 hover:bg-slate-700">
              Insertar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
