import React, { useEffect, useState } from "react";
import { CheckIcon, PencilIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function ToDo() {
  const [textInput, setTextInput] = useState("");
  const [listTasks, setListTasks] = useState([]);

  // Charger les tâches depuis le localStorage au montage
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      try {
        setListTasks(JSON.parse(savedTasks));
      } catch (error) {
        console.error("Erreur lors du parsing des données :", error);
        localStorage.removeItem("tasks");
      }
    }
  }, []);

  // Sauvegarder les tâches dans le localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(listTasks));
  }, [listTasks]);

  // Ajouter une tâche
  function handleAddClick(e) {
    e.preventDefault();
    if (textInput.trim() === "") return;

    setListTasks((prev) => [
      ...prev,
      { text: textInput, isCompleted: false },
    ]);
    setTextInput("");
  }

  // Supprimer une tâche
  function handleDelete(index) {
    setListTasks((prev) => prev.filter((_, i) => i !== index));
  }

  // Valider/Invalider une tâche
  function handleToggleComplete(index) {
    setListTasks((prev) =>
      prev.map((task, i) =>
        i === index ? { ...task, isCompleted: !task.isCompleted } : task
      )
    );
  }

  // Éditer une tâche
  function handleEdit(index, newText) {
    setListTasks((prev) =>
      prev.map((task, i) => (i === index ? { ...task, text: newText } : task))
    );
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-4 text-teal-700">
          Tâches du jour
        </h1>
        <div className="flex gap-2 mb-4">
          <input
            className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
            value={textInput}
            onChange={(event) => setTextInput(event.target.value)}
            placeholder="Ajouter une tâche"
          />
          <button
            onClick={handleAddClick}
            className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-800"
          >
            Ajouter
          </button>
        </div>
        <hr className="my-4" />
        <div className="space-y-4">
          {listTasks.map((task, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-2 border rounded ${
                task.isCompleted ? "bg-gray-200" : ""
              }`}
            >
              <div
                className={`flex-grow ${
                  task.isCompleted ? "line-through text-gray-500" : ""
                }`}
              >
                {task.text}
              </div>
              <div className="flex items-center gap-2">
                {/* Valider/Invalider */}
                <button
                  onClick={() => handleToggleComplete(index)}
                  className={`p-1 rounded ${
                    task.isCompleted
                      ? "bg-yellow-500 hover:bg-yellow-700 text-white"
                      : "bg-green-500 hover:bg-green-700 text-white"
                  }`}
                >
                  {task.isCompleted ? (
                    <XMarkIcon className="w-5 h-5" />
                  ) : (
                    <CheckIcon className="w-5 h-5" />
                  )}
                </button>
                {/* Éditer */}
                <button
                  onClick={() => {
                    const newText = prompt("Modifier la tâche :", task.text);
                    if (newText !== null && newText.trim() !== "") {
                      handleEdit(index, newText.trim());
                    }
                  }}
                  className="p-1 bg-blue-500 hover:bg-blue-700 text-white rounded"
                >
                  <PencilIcon className="w-5 h-5" />
                </button>
                {/* Supprimer */}
                <button
                  onClick={() => handleDelete(index)}
                  className="p-1 bg-red-500 hover:bg-red-700 text-white rounded"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </form>
    </div>
  );
}
