import { useState, useEffect } from 'react';
import { useAnimate } from 'motion/react';

import { Menu } from './Menu';
import { MenuToggle } from '../ui/MenuToggle';

function useMenuAnimation(isOpen: boolean) {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    // const menuAnimations = isOpen
    //   ? [
    //       [
    //         "nav",
    //         { transform: "scale(1)", opacity: 1 },
    //         { ease: [0.08, 0.65, 0.53, 0.96], duration: 0.6 },
    //         { transform: "scale(1)", opacity: 1 , filter: true}
    //       ],
    //       [
    //         "li",
    //         { transform: "scale(1)", opacity: 1, filter: "blur(0px)" },
    //         { delay: stagger(0.25), at: "-0.1" },
    //         { ease: [0.08, 0.65, 0.53, 0.96], duration: 0.6 }

    //       ],
    //     ]
    //   : [
    //       [
    //         "li",
    //         { transform: "scale(0.5)", opacity: 0, filter: "blur(10px)" },
    //         { delay: stagger(0.50, { from: "last" }), at: "<" },
    //         { ease: [0.08, 0.65, 0.53, 0.96], duration: 0.6 }
    //       ],
    //       ["nav", { transform: "scale(0)" , opacity: 0} , { at: "-0.1" }],
    //       { ease: [0.08, 0.65, 0.53, 0.96], duration: 0.6 },
    //         { transform: "scale(1)", opacity: 1 , filter: true}
    //     ];

    animate([
      [
        'path.top',
        { d: isOpen ? 'M 3 16.5 L 17 2.5' : 'M 2 2.5 L 20 2.5' },
        { at: '<' },
      ],
      ['path.middle', { opacity: isOpen ? 0 : 1 }, { at: '<' }],
      [
        'path.bottom',
        { d: isOpen ? 'M 3 2.5 L 17 16.346' : 'M 2 16.346 L 20 16.346' },
        { at: '<' },
      ],
    ]);
  }, [isOpen, animate]);

  return scope;
}

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const scope = useMenuAnimation(isOpen);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50"
          onClick={() => setIsOpen(false)}
        />
      )}
      <div ref={scope} className="flex items-center sm:hidden">
        {isOpen && <Menu setIsOpen={setIsOpen} />}
        <MenuToggle toggle={() => setIsOpen(!isOpen)} />
      </div>
    </>
  );
}
