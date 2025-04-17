import './dashboardpage.css'
import {useAuth} from "@clerk/clerk-react"

const Dashboardpage = () =>{

    const {userId} = useAuth();

    const handleSubmit = async(e) =>{
        e.preventDefault();

        const text = e.target.text.value;
        if(!text || !userId) return;

        await fetch("http://localhost:3000/api/chats",{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({userId,text}),    
        });
    };

    return (
        <div className='dashboardPage'>
            <div className="texts">
                <div className="logo">
                    <img src="/logo.png" alt="" />
                    <h1>RUSHI'S AI</h1>
                </div>
                <div className="options">
                    <div className="option">
                        <img src="/chat.png" alt="" />
                        <span>Create a new chat</span>
                    </div>
                    <div className="option">
                        <img src="/image.png" alt="" />
                        <span>Analyze images</span>
                    </div>
                    <div className="option">
                        <img src="/code.png" alt="" />
                        <span>Help me with my code</span>
                    </div>                    
                </div>
            </div>
            <div className="formContainer">
                <form onSubmit={handleSubmit}>
                    <input type="text" name="text" placeholder='Ask me anything...' />
                    <button>
                        <img src="/arrow.png" alt="" />
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Dashboardpage