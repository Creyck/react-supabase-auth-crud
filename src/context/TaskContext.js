import { createContext, useContext, useState } from "react";
import {supabase} from "../supabase/client";

export const TaskContext = createContext()


//* Custom hook para usar el contexto
export const useTasks = () => {
    const context = useContext(TaskContext)
    if(!context) throw new Error("useTasks must be used within a TaskContextProvider")
    return context
}

//* Componente proveedor del contexto
export const TaskContextProvider = ({ children }) => {

    const [tasks, setTasks] = useState([])
    const [adding, setAdding] = useState(false)
    const [loading, setLoading] = useState(false)


    const getTasks = async (done = false) => {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser(); //Obtenemos el usuario autenticado
            const {error, data} = await supabase
            .from("tasks")  
            .select()
            .eq("userId", user.id) //filtra las tareas por el id del usuario autenticado
            .eq("done", done)   //filtra las tareas que no estan completadas
            .order("id", { ascending: true }); //ordena las tareas por id de forma ascendente
            
            if(error) throw error
                
            setTasks(data)
            setLoading(false);
    };


//*Funcion para crear una nueva tarea

    const createTask = async(taskName) => {  //Recibimos el nombre de la tarea como parametro
    setAdding(true);
    try {
    const { data: { user } } = await supabase.auth.getUser();
    console.log(user);  //Verificamos si hay un usuario autenticado
    const {error,data} = await supabase.from('tasks').insert({  
        name: taskName,   //En la columna Name de Supabase agregamos el valor del estado taskName
        userId: user.id  //Agregamos el userId del usuario autenticado
    })
    
    if(error) throw error
    await getTasks(); // Actualiza el estado tasks obteniendo las tareas más recientes
    } catch (error) { 
        console.error(error);
    }
    finally{
        setAdding(false);
    }
    }

const deleteTask = async (id) => {
    const {error,data, data: { user } } = await supabase.auth.getUser();
    await supabase
    .from("tasks")
    .delete()
    .eq("id", id)
    .eq("userId", user.id) //Elimina la tarea con el id especificado y que pertenece al usuario autenticado

    if(error) throw error
    setTasks(tasks.filter(task => task.id !== id)) //Actualiza el estado tasks eliminando la tarea con el id especificado
    console.log(data)
}

const updateTask = async (id, updateFields) => {
    const {error,data, data: { user } } = await supabase.auth.getUser();
    await supabase
    .from("tasks")
    .update(updateFields)
    .eq("id", id)
    .eq("userId", user.id) //Actualiza la tarea con el id especificado y que pertenece al usuario autenticado

    if(error) throw error
    setTasks(tasks.filter(task => task.id !== id) )
}


//* Proveemos el estado y las funciones a los componentes hijos
    return <TaskContext.Provider value={{tasks, getTasks, createTask, adding, loading, deleteTask, updateTask}}>
        {children}
    </TaskContext.Provider>
}