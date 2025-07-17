import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Badge,
} from "@heroui/react";
import { IoIosNotifications } from "react-icons/io";
import NotificationCard from "./NotificationCard";
import { useNotificationStore } from "../../store/useNotificationStore";
import { BiChevronDown } from "react-icons/bi";
import NotificationDrawer from "./NotificationDrawer";
import { useState } from "react";

interface NotificationsProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export default function Notifications({ isOpen, onOpen, onClose }: NotificationsProps) {
  const { notifications } = useNotificationStore();

  const [isOpenPopover, setIsOpenPopover] = useState(false);

  const notificationsNotRead = notifications.filter(
    (notification) => !notification.isRead
  );

  return (
    <>
      <Popover placement="bottom-end" isOpen={isOpenPopover} onOpenChange={(open) => setIsOpenPopover(open)}>
        <PopoverTrigger>
          <button className="sm:p-2 flex items-center justify-center md:border-b-2 md:border-blue-500 md:border-opacity-0 hover:border-opacity-100 hover:text-blue-500 duration-200 cursor-pointer">
            <Badge
              color="danger"
              content={notificationsNotRead.length}
              isInvisible={notificationsNotRead.length === 0}
              size="sm"
            >
              <IoIosNotifications size={25} className={notificationsNotRead.length !== 0 ? "animate-pulse" : ""}/>
            </Badge>
          </button>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <div className="block right-0 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Notificaciones
                </h3>
                <BiChevronDown className="w-5 h-5 text-gray-500" />
              </div>
            </div>
            <div className="max-h-full overflow-y-auto">
              {notifications.slice(0, 5).map((notification) => (
                <NotificationCard key={notification.id} {...notification} />
              ))}
            </div>
            <div className="p-4 border-t border-gray-100">
              <button onClick={() => {
                onOpen()
                setIsOpenPopover(false)
              }} className="w-full text-center text-sm text-blue-600 hover:text-blue-700">
                Ver todas las notificaciones
              </button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      <NotificationDrawer isOpen={isOpen} onClose={onClose} />
    </>
  );
}
