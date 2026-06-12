1. **Add CSS for new Semantic layer block**
   - Add styling in `style.css` for `.semantic-architecture`, `.arch-layer`, `.arch-layer-title`, `.arch-layer-items`, `.data-flow-particles`, `.particle`, `.story-step`, `.semantic-story-steps`, and `.semantic-story-content`. Include keyframes for `flowUp`.
2. **Add HTML for Semantic Intelligence project**
   - In `index.html` within the `.product-cards-grid` section, insert the new product card `card-semantic` just before `card-mcp` or after `card-topic`. The new HTML should follow the `<div class="product-card" id="card-semantic">...</div>` structure with the details from the user prompt: "Building the Semantic Foundation for AI-Native Analytics".
3. **Add JS for Semantic Intelligence interactions**
   - In `script.js`, append logic to handle the particles in `.data-flow-particles` and click listeners for the `.story-step` items to swap the visible `.story-pane`.
4. **Pre-commit checks**
   - Run verification tests to ensure the layout matches user expectations. Ensure pre commit tasks are complete.
