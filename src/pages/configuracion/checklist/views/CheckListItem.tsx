export function ChecklistItem({
  item,
  eliminarItemPersonalizado,
  toggleChecklistItem,
  updateItemValue,
  modoPlantilla,
  isUpdate,
}) {
  return (
    <div className="p-3 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">{item.texto}</span>
          {item.personalizado && (
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
              Personalizado
            </span>
          )}
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
            {item.tipo === "checkbox"
              ? "Checkbox"
              : item.tipo === "numeric"
              ? "Numérico"
              : "Texto"}
          </span>
        </div>

        {(modoPlantilla && item.personalizado) || isUpdate ? (
          <button
            type="button"
            onClick={() => eliminarItemPersonalizado(item.id)}
            className="text-red-500 hover:text-red-700 text-sm"
          >
            ×
          </button>
        ) : null}
      </div>

      {/* Campo */}
      {item.tipo === "checkbox" ? (
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={item.checked || false}
            onChange={() => toggleChecklistItem(item.id)}
          />
          <span
            className={`text-sm ${
              item.checked ? "line-through text-gray-500" : ""
            }`}
          >
            Completado
          </span>
        </div>
      ) : item.tipo === "numeric" ? (
        <input
          type="number"
          placeholder="Ingrese valor numérico"
          value={item.valor || ""}
          onChange={(e) => updateItemValue(item.id, Number(e.target.value))}
          className="w-full"
        />
      ) : (
        <input
          type="text"
          placeholder="Ingrese texto"
          value={item.valor || ""}
          onChange={(e) => updateItemValue(item.id, e.target.value)}
          className="w-full"
        />
      )}
    </div>
  );
}
