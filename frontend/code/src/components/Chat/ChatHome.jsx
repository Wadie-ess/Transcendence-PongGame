import { Layout } from "../Layout";
import UserImage from "./assets/aymane.png";

const Chat = () => {
  return (
    <>
      <Layout>
        <h1>
          <MessagePlaceHolder />
        </h1>
      </Layout>
    </>
  );
};

export const MessagePlaceHolder = () => {
  return (
    <div className="message-container flex mb-4">
      <div className="user-image flex-shrink-0 mr-2">
        <img
          className="h-10 w-10 rounded-full"
          src={UserImage}
          alt={`second's Profile`}
        />
      </div>
      <div className="align-middle flex flex-col">
        <p className="text-lg">Aymane</p>
        <p className="text-sm">Test Message</p>
      </div>
    </div>
  );
};

export default Chat;
