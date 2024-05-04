const Login = document.querySelector(".Login")
const LoginForm = Login.querySelector(".Login__form") 
const LoginInput = Login.querySelector(".Login__input")

const Chat = document.querySelector(".Chat")
const ChatForm = Chat.querySelector(".Chat__form") 
const ChatInput = Chat.querySelector(".Chat__input")
const ChatMessages = Chat.querySelector(".Chat__messages")

const colors = [
    "cadetblue",
    "darkgoldenrod",
    "cornflowerblue",
    "darkkhaki",
    "hotpink",
    "gold"
]

const user = { id: "", name: "", color: ""} 

let websocket

const createMessageSelfElement = (content) => {
    const div = document.createElement("div")
    div.classList.add("message--self")
    div.innerHTML = content
    return div
}

const createMessageOtherElement = (content, sender, senderColor) => {
    const div = document.createElement("div")
    const span = document.createElement("span")

    div.classList.add("message--other")
    div.classList.add("message--self")
    span.classList.add("message--sender")

    
    span.style.color = senderColor
div.appendChild(span)
    span.innerHTML = sender
    div.innerHTML += content
    return div
}

const getRandomColor = () => {
    const randomIndex =  Math.floor(Math.random() * colors.length)
return colors[randomIndex]
}

const scrollScreen =() => {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
    })
}
const processMessage = ({data}) => {
    const {userId, userName, userColor, content } = JSON.parse(data)
const message = userId == user.id ? createMessageSelfElement(content) : createMessageOtherElement(content, userName, userColor)
    const element = createMessageOtherElement(content, userName, userColor)
  ChatMessages.appendChild(message)
  scrollScreen()
}
const handleLogin = (event) => {
event.preventDefault()

user.id  = crypto.randomUUID()
user.name = LoginInput.value
user.color = getRandomColor()
Login.style.display = "none"
Chat.style.display = "flex"

websocket = new WebSocket("ws://localhost:8080")
websocket.onmessage = processMessage


}
const sendMessage = (event) => {
event.preventDefault()
const message = {
    userId: user.id,
    userName: user.name,
    userColor: user.color,
    content: ChatInput.value
}
websocket.send(JSON.stringify(message))

ChatInput.value = ""
}

LoginForm.addEventListener("submit", handleLogin)
ChatForm.addEventListener("submit", sendMessage )

