import { cn } from "@/lib/utils";
import { Mic, Video, LogOut, MoreVertical, Subtitles ,Play,Pause} from "lucide-react";
import { IconLayoutNavbarCollapse } from "@tabler/icons-react";
import { useTranscription } from "@/providers/Transcription";
import { Button } from "./button";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  MotionValue
} from "framer-motion";
import Link from "next/link";
import { useRef, useState } from "react";

interface DockItem {
  title: string;
  href: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  onClick?: () => void;
}
interface FloatingDockProps {

  desktopClassName?: string;
  mobileClassName?: string;
}

export const FloatingDock: React.FC<FloatingDockProps> = ({
  desktopClassName,
  mobileClassName
}) => {

  const { startTranscription, stopTranscription } = useTranscription();
  
const items = [
  { title: "Mic", href: "#", Icon: Mic },
  { title: "Video", href: "#", Icon: Video },
  { title: "Subtitles", href: "#", Icon: Subtitles },
  { title: "Start Subtitles", href: "#", Icon: Play, onClick: startTranscription },
  { title: "Stop", href: "#", Icon: Pause, onClick: stopTranscription },
];

  return (
    <>
      <FloatingDockDesktop items={items} className={desktopClassName} />
      <FloatingDockMobile items={items} className={mobileClassName} />
    </>
  );
};

interface FloatingDockMobileProps {
  items: DockItem[];
  className?: string;
}

const FloatingDockMobile: React.FC<FloatingDockMobileProps> = ({
  items,
  className
}) => {
  const [open, setOpen] = useState(false);
 
  return (
    <div className={cn("relative block md:hidden", className)}>
   
      <AnimatePresence>
        {open && (
          <motion.div
            layoutId="nav"
            className="absolute bottom-full mb-2 inset-x-0 flex flex-col gap-2"
          >
            {items.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{
                  opacity: 0,
                  y: 10,
                  transition: { delay: idx * 0.05 },
                }}
                transition={{ delay: (items.length - 1 - idx) * 0.05 }}
              >
                <Button

                  className="h-10 w-10 rounded-full bg-gray-50 dark:bg-neutral-900 flex items-center justify-center"
                  onClick={item.onClick}
                >
                  <div className="h-4 w-4">
                    <item.Icon className="w-full h-full" />
                  </div>
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setOpen(!open)}
        className="h-10 w-10 rounded-full bg-gray-50 dark:bg-neutral-800 flex items-center justify-center"
      >
        <IconLayoutNavbarCollapse className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />
      </button>
    </div>
  );
};

interface FloatingDockDesktopProps {
  items: DockItem[];
  className?: string;
}

const FloatingDockDesktop: React.FC<FloatingDockDesktopProps> = ({
  items,
  className
}) => {
  const mouseX = useMotionValue(Infinity);

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "mx-auto hidden md:flex h-16 gap-4 items-end rounded-2xl bg-gray-50 dark:bg-neutral-900 px-4 pb-3",
        className
      )}
    >
      {items.map((item) => (
        <IconContainer key={item.title} mouseX={mouseX} {...item} />
      ))}
    </motion.div>
  );
};

interface IconContainerProps extends DockItem {
  mouseX: MotionValue<number>;
}

const IconContainer: React.FC<IconContainerProps> = ({
  mouseX,
  title,
  Icon,
  href,
  onClick
}) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const width = useSpring(useTransform(distance, [-150, 0, 150], [40, 80, 40]), {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const height = useSpring(useTransform(distance, [-150, 0, 150], [40, 80, 40]), {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const widthIcon = useSpring(
    useTransform(distance, [-150, 0, 150], [20, 40, 20]),
    { mass: 0.1, stiffness: 150, damping: 12 }
  );

  const heightIcon = useSpring(
    useTransform(distance, [-150, 0, 150], [20, 40, 20]),
    { mass: 0.1, stiffness: 150, damping: 12 }
  );

  const [hovered, setHovered] = useState(false);

  return (
    <Link href={href}>
      <motion.div
        ref={ref}
        style={{ width, height }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={onClick}
        className="aspect-square rounded-full bg-gray-200 dark:bg-neutral-800 flex items-center justify-center relative"
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 10, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 2, x: "-50%" }}
              className="px-2 py-0.5 whitespace-pre rounded-md bg-gray-100 border dark:bg-neutral-800 dark:border-neutral-900 dark:text-white border-gray-200 text-neutral-700 absolute left-1/2 -translate-x-1/2 -top-8 w-fit text-xs"
            >
              {title}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          style={{ width: widthIcon, height: heightIcon }}
          className="flex items-center justify-center"
        >
          <Icon className="w-full h-full" />
        </motion.div>
      </motion.div>
    </Link>
  );
};
