const MyReact = (function () {
  let hooks = [],
    currHook = 0;

  return {
    render(Component) {
      const Comp = Component();
      Comp.render();
      currHook = 0;
      return Comp;
    },

    useEffect(callback, depArray) {
      const hasNoDeps = !depArray;
      const deps = hooks[currHook];
      const hasChangedDeps = deps
        ? depArray.some((el, i) => el !== deps[i])
        : true;

      if (hasNoDeps || hasChangedDeps) {
        callback();
        hooks[currHook] = depArray;
      }

      currHook++;
    },

    useState(initialValue) {
      hooks[currHook] = hooks[currHook] || initialValue;

      const myHook = currHook;
      const setState = (val) => (hooks[myHook] = val);

      return [hooks[currHook++], setState];
    },

    useRef(initialValue) {
      return this.useState({ current: initialValue })[0];
    },

    useArrayRef(initialValue) {
      return this.useState([initialValue])[0];
    },
  };
})();

// NOTE: `use` is a convention - here at least
function aCustomHook(domain) {
  const [text, setDomain] = MyReact.useState(domain);
  const split = text.split(".");
  return [split, setDomain];
}

console.log(`React Lite`);

function C() {
  const numRenders = MyReact.useRef(0);
  const [c, s] = MyReact.useState(0);
  const [t, st] = MyReact.useState("type");
  const r = MyReact.useRef(c);
  const aR = MyReact.useArrayRef(c);
  const [splitDomain, setDomain] = aCustomHook("me.example.com");

  MyReact.useEffect(() => {
    console.log(`effect: c=${c}, t=${t}`);
  }, [c, t]);

  return {
    click: () => {
      const nc = s(c + 1);
      r.current = -nc;
      aR[0] = -2 * nc;
    },
    type: (s) => {
      st(s);
    },
    domain: (d) => {
      setDomain(d);
    },
    render: () => {
      numRenders.current++;
      console.log(
        `#${numRenders.current}: c = ${c}, t = ${t}, r = ${r.current}, ar = ${aR[0]}, splitDomain = [${splitDomain}]`
      );
    },
  };
}

let Comp;

Comp = MyReact.render(C);
Comp.click();
Comp = MyReact.render(C);
Comp.type("ha ha!");
Comp = MyReact.render(C);
Comp.click();
Comp = MyReact.render(C);
Comp.domain("news.bbc.co.uk");
Comp = MyReact.render(C);
