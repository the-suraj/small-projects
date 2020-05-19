window.addEventListener('load', async () => {
	try {
		const result = await WebAssembly.instantiateStreaming(fetch("./add.wasm"), {
			main: {
				sayHello() {
					print("Assembly Message: Hello From Web Assembly..!")
				},
			},
			env: {
				abort(_msg, _file, line, column) {
					print("Error Report: abort called at main.ts:" + line + ":" + column);
				}
			},
		});
		const exports = result.instance.exports;
		print("Operation: Performing Addition in Web Assembly: 19 + 23");
		print("Result: 19 + 23 = " + exports.add(19, 23));
	}
	catch (error) {
		print("Error Report: " + error);
	}
})

function print(msg) {
	document.getElementById("container").innerText += msg + "\n";
}