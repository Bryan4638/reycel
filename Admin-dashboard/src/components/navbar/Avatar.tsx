import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Button,
  useDisclosure,
} from "@heroui/react";
import { useAuth } from "../../context/AuthContext";
import { MdLogout } from "react-icons/md";
import ModalEditUser from "../ModalEditUser";

const Avatar = () => {
  const { user, logout } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Popover placement="bottom-end">
      <PopoverTrigger>
        <button
          type="button"
          className="p-2 text-gray-500 rounded-lg hover:text-primary-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 "
          id="user-menu-button"
          aria-expanded="false"
          data-dropdown-toggle="dropdown"
        >
          {user?.image && (
            <img
              className="w-5 h-5 rounded-full"
              src={user.image}
              alt="user photo"
            />
          )}
          {!user?.image && (
            <svg
              className="w-6 h-6"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fillRule="evenodd"
                d="M12 20a7.966 7.966 0 0 1-5.002-1.756l.002.001v-.683c0-1.794 1.492-3.25 3.333-3.25h3.334c1.84 0 3.333 1.456 3.333 3.25v.683A7.966 7.966 0 0 1 12 20ZM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10c0 5.5-4.44 9.963-9.932 10h-.138C6.438 21.962 2 17.5 2 12Zm10-5c-1.84 0-3.333 1.455-3.333 3.25S10.159 13.5 12 13.5c1.84 0 3.333-1.455 3.333-3.25S13.841 7 12 7Z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="min-w-full flex flex-col gap-1">
          <div className="flex flex-col min-w-full justify-center items-center text-md text-gray-500 border-b-1">
            <span>{user && user.username}</span>
          </div>

          <div className="min-w-full">
            <Button
              endContent={
                <svg
                  className="mx-auto w-5 h-5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                </svg>
              }
              className="min-w-full"
              variant="light"
              size="md"
              color="default"
              onPress={onOpen}
            >
              Editar Perfil
            </Button>
            <ModalEditUser
              isOpen={isOpen}
              onClose={onClose}
              id={user?.userId}
              username={user?.username}
              image={user?.image}
            />
          </div>
          <div className="min-w-full">
            <Button
              endContent={<MdLogout className="min-h-5 min-w-5" />}
              className="min-w-full"
              variant="light"
              size="md"
              color="danger"
              onClick={logout}
            >
              Log Out
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Avatar;
