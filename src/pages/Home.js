import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import { useNavigate } from "react-router-dom";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";

function Home() {

  const navigate = useNavigate();
  const [showTaskDone, setShowTaskDone] = useState(false)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser(); //verifica si hay un usuario autenticado
      if (!user) {
        navigate('/login');
      }
    };
    checkUser();
  }, [navigate])

  return (
    <div className="row pt-4">
      <div className="col-md-4 offset-md-4">
         <TaskForm />

      <header className="d-flex justify-content-between my-3">
        <span className="h5">
          {showTaskDone ? 'Completed Tasks' : 'Pending Tasks'}
        </span>
        <button className="btn btn-dark btn-sm" onClick={() => setShowTaskDone(!showTaskDone)}>{showTaskDone ? 'Show Pending Tasks' : 'Show Completed Tasks'}</button>
      </header>

      <TaskList done={showTaskDone} />
      </div>

    </div>
  );
}

export default Home;
