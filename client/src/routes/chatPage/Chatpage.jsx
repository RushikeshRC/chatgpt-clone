import './chatpage.css'
import NewPrompt from '../../components/newPrompt/NewPrompt'

const Chatpage = () =>{   

    return (
        <div className='chatPage'>
            <div className="wrapper">
                <div className="chat">
                    <div className="message">Test message form ai</div>
                    <div className='message user'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. 
                        Corrupti obcaecati culpa delectus atque similique error aperiam, sunt quibusdam veritatis vero, 
                        ex quo autem incidunt quasi, velit alias necessitatibus laborum corporis.</div>
                    <div className="message">Test message form ai</div>
                    <div className='message user'>Test message from user</div>
                    <div className="message">Test message form ai</div>
                    <div className='message user'>Test message from user</div>
                    <div className="message">Test message form ai</div>
                    <div className='message user'>Test message from user</div>
                    <div className="message">Test message form ai</div>
                    <div className='message user'>Test message from user</div>
                    <div className="message">Test message form ai</div>
                    <div className='message user'>Test message from user</div>
                    <div className="message">Test message form ai</div>
                    <div className='message user'>Test message from user</div>
                    <div className="message">Test message form ai</div>
                    <div className='message user'>Test message from user</div>
                    <NewPrompt/>
                </div>
            </div>
        </div>
    );
};

export default Chatpage;