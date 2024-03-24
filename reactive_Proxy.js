function observe(obj) {
	const dep = new Set();
	obj.value = new Proxy(obj, {
		get(target, propKey, receiver) {
			if (activeUpdate) {
				dep.add(activeUpdate);
			}
			return target[propKey];
		},
		set(target, prop, value) {
			target[prop] = value;
			dep.forEach(item => item());
			return true;
		},
	});
}

let activeUpdate;

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
observe(state);

autorun(() => {
	console.log(state.value.count);
	console.log(state.value.info.name);
});
state.value.count++;
state.value.info.name = "李四";
