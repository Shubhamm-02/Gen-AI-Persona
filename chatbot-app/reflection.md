# Reflection

## What Worked

The most impactful decision was investing time in persona research before writing a single line of the system prompt. Reading through LinkedIn posts, talk transcripts, and class tutorial styles for each persona gave me concrete material to work with -- specific phrases they use, topics they gravitate toward, and the way they structure advice. This made the difference between a generic "be helpful and friendly" prompt and one that actually captures how each person communicates.

The few-shot examples turned out to be the strongest lever for controlling output quality. While the persona description and style instructions set the general direction, the examples locked in the specific tone, length, and structure I wanted. When I tested prompts without few-shot examples, the model would occasionally drift into overly formal or overly casual registers. The examples acted as anchors that kept responses consistent across conversations.

Using a chain-of-thought instruction produced noticeably better responses, especially for nuanced career questions. Without it, the model tended to give surface-level advice that could apply to anyone. With CoT, responses showed more awareness of the user's specific situation -- for instance, distinguishing between advice for a fresher versus someone with two years of experience.

## What GIGO Taught Me

The Garbage In, Garbage Out principle was not just a concept in this project -- it was the central lesson. My first draft of the Anshuman persona prompt was two sentences: "You are Anshuman Singh, CTO of Scaler. Be technical and direct." The output was technically correct but completely generic. It could have been any technical advisor on the internet.

When I expanded the prompt with specific values (depth over breadth), concrete communication patterns (reframes vague questions, no filler words), and real examples of how he would answer different types of questions, the output quality jumped dramatically. The model started producing responses that felt like they came from a specific person, not a template.

This taught me that prompt engineering is fundamentally about precision of input. Vague instructions produce vague outputs. Specific, well-structured instructions -- grounded in real research -- produce specific, useful outputs. The quality ceiling of the output is set by the quality floor of the input.

## What I Would Improve

If I had more time, I would add conversation memory persistence so that context carries across page refreshes. Currently, refreshing the page loses the entire conversation history. I would also implement streaming responses instead of waiting for the full response, which would make the experience feel more natural for longer answers.

On the prompt side, I would conduct user testing with people who actually know these personas and iterate based on their feedback. There are likely nuances in how each person communicates that I missed from public content alone. I would also experiment with temperature settings per persona -- a teaching persona might benefit from slightly more creative phrasing, while a technical CTO persona might benefit from lower temperature for more precise answers.

Finally, I would add a feedback mechanism where users can flag responses that feel "off character," which could inform prompt refinements over time.
