import { useState, useEffect} from "react"
import { supabase } from "../supabase/client"
import { useNavigate } from "react-router-dom";

function Login() {

    const [email, setEmail] = useState('');   //Usamos un estado para guardar el email
    const navigate = useNavigate();

    const handlesubmit = async (e) => {    //Funcion que se ejecuta al enviar el formulario autenticando el usuario
        e.preventDefault();
        try {
            await supabase.auth.signInWithOtp({
            email,
        })
        } catch (error) {   
            console.error(error);
        }
    }
    

 useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        navigate('/');
      }
    };
    checkUser();
  }, [navigate])


    return(     
        <div className="row pt-4">
          <div className="col-md-4 offset-md-4">
            <form onSubmit={handlesubmit} className="card card-body">
            <input type="email" name="email" placeholder="youremail@site.com" onChange={e => setEmail(e.target.value)} className="form-control mb-2" />  {/* Input para el email que actualiza el estado guardando el valor en setEmail*/}
            <button className="btn btn-success">Send</button>
            </form>
          </div>
        </div>
    )
}

export default Login