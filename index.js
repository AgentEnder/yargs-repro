require("yargs")
    .parserConfiguration({
        "strip-dashed": true,
    })
    .completion(
        "completion",
        "Outputs a script to set up your shell to use the completion feature.",
        () => {
            return ["bananas"];
        }
    ).argv;
