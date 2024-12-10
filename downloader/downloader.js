window.DownloadApi = {
	converter: {
		library: (_) =>
			"https://raw.githubusercontent.com/mwittrien/BetterDiscordAddons/master/Library/0BDFDB.plugin.js",
		plugin: (arg) =>
			`https://raw.githubusercontent.com/mwittrien/BetterDiscordAddons/master/Plugins/${arg}/${arg}.plugin.js`,
		theme: (arg) =>
			`https://raw.githubusercontent.com/mwittrien/BetterDiscordAddons/master/Themes/${arg}/${arg}.theme.css`,
		url: (arg) => {
			if (!arg.startsWith("https://") && !arg.startsWith("http://")) {
				const newArg = `https://raw.githubusercontent.com/mwittrien/BetterDiscordAddons/master/${arg}`;
				return newArg;
			}
			return arg;
		},
	},
	convert: (parameterString, error) => {
		if (typeof parameterString === "string")
			for (const parameter in window.DownloadApi.converter) {
				const arg =
					(parameterString.split(`?${parameter}=`)[1] || "").split("?")[0] ||
					"";
				if (arg) {
					window.DownloadApi.download(
						window.DownloadApi.converter[parameter](arg),
						error,
					);
					break;
				}
				if (parameterString.endsWith(`?${parameter}`)) {
					window.DownloadApi.download(
						window.DownloadApi.converter[parameter](),
						error,
					);
					break;
				}
			}
	},
	download: (url, error) => {
		if (!url) return error?.("No URL!");
		if (
			url.indexOf("raw.githubusercontent.com") === -1 &&
			url.indexOf("github.io") === -1
		)
			return error?.(
				`<a href="${url}">${url}</a> not a valid GitHub File URL!`,
			);
		fetch(url).then((response) => {
			if (response.status === 404)
				error?.(`GitHub File <a href="${url}">${url}</a> does not exist!`);
			else
				response.blob().then((blob) => {
					const tempLink = document.createElement("a");
					tempLink.href = window.URL.createObjectURL(blob);
					tempLink.download = url.split("/").pop();
					tempLink.click();
				});
		});
	},
};
