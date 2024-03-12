let activeUpdate;

function observe(obj) {
  Object.keys(obj).forEach((key) => {
    let value = obj[key];
    const dep = new Set();
    if (typeof obj[key] === "object") {
      observe(obj[key]);
    }
    Object.defineProperty(obj, key, {
      get() {
        if (activeUpdate) {
          dep.add(activeUpdate);
        }
        return value;
      },
      set(newVal) {
        value = newVal;
        dep.forEach((i) => i());
      },
    });
  });
}

function autorun(update) {
  function wrapperUpdate() {
    activeUpdate = wrapperUpdate;
    update();
    activeUpdate = null;
  }
  wrapperUpdate();
}

const state = {
  count: 1,
  info: {
    name: "张三",
  },
};
observe(state)

autorun(() => {
  console.log(state.info.name);
});
autorun(() => {
    console.log(state.count)
})
state.info.name = "李四";
state.count ++;
