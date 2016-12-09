/// <reference path="../LolTinyLoader/LolTinyLoader.ts"/>

let traceMessage: (message: string) => void;

function describeScopedLolTinyLoader(specDefinitions: (getTraceMessages: () => string[]) => void) {

    describe("with scoped registry and recorded trace messages", () => {

        let recordedTraceMessages: string[];
        let savedTraceMessage: any;

        beforeEach(() => {
            recordedTraceMessages = [];
            savedTraceMessage = traceMessage;
            traceMessage = (message) => { recordedTraceMessages.push(message); };

            expect(LolTinyLoader.registry.getAllModuleNames()).toEqual([], "because registrations must not leak");
        });

        afterEach(() => {
            traceMessage = savedTraceMessage;

            LolTinyLoader.registry.clear();
        });

        specDefinitions(() => recordedTraceMessages);
    });
}
