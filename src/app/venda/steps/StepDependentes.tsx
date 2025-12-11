import { useState } from "react";
import { Card } from "@/components/ui/Card"; // CardHeader removido pois não era usado
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { StepProps } from "../types";
import { Plus, Trash2 } from "lucide-react";

export function StepDependentes({ formData, handleChange }: StepProps) {
  // Controle local visual de quantos dependentes estão abertos
  const [qtd, setQtd] = useState(0);

  const add = () => setQtd((p) => Math.min(p + 1, 4));
  const remove = () => setQtd((p) => Math.max(p - 1, 0)); // Nota: Não estamos limpando os dados do state global, apenas escondendo visualmente por simplicidade e "fluidez"

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-900">Dependentes ({qtd})</h2>
        <div className="flex gap-2">
          {qtd > 0 && (
            <Button variant="danger" onClick={remove} type="button">
              <Trash2 size={16} />
            </Button>
          )}
          {qtd < 4 && (
            <Button variant="secondary" onClick={add} type="button">
              <Plus size={16} /> Adicionar
            </Button>
          )}
        </div>
      </div>

      {qtd === 0 && (
        <div className="text-center p-8 border-2 border-dashed rounded-xl text-gray-400">
          Sem dependentes. Clique em adicionar se necessário.
        </div>
      )}

      {[1, 2, 3, 4].map((i) => (
        <div key={i} className={i <= qtd ? "block" : "hidden"}>
          <Card className="border-l-4 border-l-blue-500 mb-4">
            <h3 className="font-bold text-blue-800 mb-4">Dependente {i}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-bold text-gray-900">Nome</label>
                <Input
                  name={`nomeDependente${i}`}
                  value={formData[`nomeDependente${i}`]}
                  onChange={handleChange}
                  className="bg-white"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-bold text-gray-900">CPF</label>
                <Input
                  name={`cpfDependente${i}`}
                  value={formData[`cpfDependente${i}`]}
                  onChange={handleChange}
                  className="bg-white"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-bold text-gray-900">
                  Nascimento
                </label>
                <Input
                  type="date"
                  name={`dataNascimentoDependente${i}`}
                  value={formData[`dataNascimentoDependente${i}`]}
                  onChange={handleChange}
                  className="bg-white"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-bold text-gray-900">
                  Parentesco
                </label>
                <Input
                  name={`parentescoDependente${i}`}
                  value={formData[`parentescoDependente${i}`]}
                  onChange={handleChange}
                  className="bg-white"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-bold text-gray-900">
                  Telefone
                </label>
                <Input
                  name={`telefoneDependente${i}`}
                  value={formData[`telefoneDependente${i}`]}
                  onChange={handleChange}
                  className="bg-white"
                />
              </div>
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
}
