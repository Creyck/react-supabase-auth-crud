import { createContext, useContext, useState, useCallback } from "react";
import { supabase } from "../supabase/client";

export const TaskContext = createContext();

// Custom hook
//* Custom hook para usar el contexto
export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error("useTasks must be used within a TaskContextProvider");
  return context;
};

//* Componente proveedor del contexto
export const TaskContextProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState(false);


const getTasks = useCallback(async (done = false) => {
  setLoading(true);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  //* Si no hay usuario, no hacemos la consulta
  if (!user) {
    setTasks([]);
    setLoading(false);
    return;
  }

  const { data, error } = await supabase
    .from("tasks")
    .select()
    .eq("userId", user.id)
    .eq("done", done)
    .order("id", { ascending: true });

  if (error) {
    console.error(error);
  } else {
    setTasks(data || []);
  }

  setLoading(false);
}, []);

//*Funcion para crear una nueva tarea
  const createTask = async (taskName) => {
  setAdding(true);

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return; // 👈 evita crash si no hay sesión

    const { error } = await supabase.from("tasks").insert({
      name: taskName,
      userId: user.id,
    });

    if (error) throw error;

    await getTasks();
  } catch (error) {
    console.error(error);
  } finally {
    setAdding(false);
  }
};


  //* Eliminar tarea
  const deleteTask = async (id) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", id)
    .eq("userId", user.id);

  if (error) {
    console.error(error);
    return;
  }

  setTasks(tasks.filter((task) => task.id !== id));
};


  //* Actualizar tarea
  const updateTask = async (id, updateFields) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { error } = await supabase
    .from("tasks")
    .update(updateFields)
    .eq("id", id)
    .eq("userId", user.id);

  if (error) {
    console.error(error);
    return;
  }

  setTasks(tasks.filter((task) => task.id !== id));
};


  return (
    <TaskContext.Provider
      value={{
        tasks,
        getTasks,
        createTask,
        adding,
        loading,
        deleteTask,
        updateTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

