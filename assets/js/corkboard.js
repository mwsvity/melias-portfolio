/**
 * Melia Winisa | Investigation Corkboard — Projects & Previous Works
 * Interactive Polaroid Evidence Board + Dynamic Red String SVG Physics
 */

(function () {
    'use strict';

    const corkboardSurface = document.getElementById('corkboardSurface');
    const redStringSvg = document.getElementById('redStringSvg');
    const redStringPinSvg = document.getElementById('redStringPinSvg');
    if (!corkboardSurface || !redStringSvg) return;

    const stringShadowGroup = document.getElementById('stringShadowGroup');
    const stringMainGroup = document.getElementById('stringMainGroup');
    const stringFiberGroup = document.getElementById('stringFiberGroup');
    const stringKnotGroup = document.getElementById('stringKnotGroup');

    const pinnedItems = Array.from(document.querySelectorAll('.board-pinned-item'));
    const polaroidCards = Array.from(document.querySelectorAll('.polaroid-card'));
    const filterButtons = Array.from(document.querySelectorAll('.corkboard-filter-btn'));
    const toggleStringsBtn = document.getElementById('toggleStringsBtn');
    const resetBoardBtn = document.getElementById('resetBoardBtn');

    // ==========================================
    // Red String Investigation Network Connections
    // ==========================================
    const stringConnections = [
        // Central Case Banner Hub -> Top Row Exhibits
        { from: 'node-hub', to: 'node-proj-1' },
        { from: 'node-hub', to: 'node-proj-2' },
        { from: 'node-hub', to: 'node-proj-3' },

        // Top Row Evidence Chain
        { from: 'node-proj-1', to: 'node-proj-2' },
        { from: 'node-proj-2', to: 'node-proj-3' },

        // Left Clue Thread Channel
        { from: 'node-proj-1', to: 'node-note-left' },
        { from: 'node-note-left', to: 'node-proj-2' },
        { from: 'node-note-left', to: 'node-proj-4' },
        { from: 'node-note-left', to: 'node-proj-5' },

        // Right Clue Thread Channel
        { from: 'node-proj-2', to: 'node-note-right' },
        { from: 'node-proj-3', to: 'node-note-right' },
        { from: 'node-note-right', to: 'node-proj-5' },
        { from: 'node-note-right', to: 'node-proj-6' },

        // Bottom Row Evidence Chain
        { from: 'node-proj-4', to: 'node-proj-5' },
        { from: 'node-proj-5', to: 'node-proj-6' }
    ];

    // ==========================================
    // Project Evidence Database (Rigorously Structured Case Studies)
    // ==========================================
    const projectDatabase = {
        'proj-1': {
            exhibit: 'EXHIBIT #01',
            categoryStamp: 'BRANDING // PACKAGING',
            category: 'branding',
            year: 'CASE // 2026',
            title: 'I Scream',
            subtitle: 'Playful Branding & Packaging for a Vegan Onion Ice Cream',
            caption: 'I Scream: branding and packaging for a vegan onion ice cream',
            timeline: '7+ Weeks • Cross-Faculty Collaboration (UPH DKV × UPH Food Tech, 2026)',
            deliverables: 'Logo, Mascots, Merch Designs, Primary Dine-In Packaging, Secondary Dine-In Packaging, Primary Takeaway Packaging, Secondary Takeaway Packaging, Physical Prototypes',
            tools: 'Adobe Photoshop, Adobe InDesign, Illustrator',
            themeBg: 'linear-gradient(145deg, #1b387a 0%, #2952a8 50%, #4477d9 100%)',
            coverImage: 'assets/image/projects/iscream/cover.png',
            images: [
                {
                    src: 'assets/image/projects/iscream/01-mascots.png',
                    caption: 'The mascot family, drawn in continuous line',
                    label: 'Mascot Designs',
                    bg: '#ffffff',
                    aspectRatio: '2560 / 1213'
                },
                {
                    src: 'assets/image/projects/iscream/02-pattern.png',
                    caption: 'Letter pattern and mascot parade',
                    label: 'Letter Pattern',
                    bg: '#293896',
                    aspectRatio: '1 / 1'
                },
                {
                    src: 'assets/image/projects/iscream/03-cups.png',
                    caption: 'To-go cups with flavor badges (Avocado, Ube, Strawberry, Banana, Onion)',
                    label: 'To-Go Cups',
                    bg: '#f4f3ed',
                    aspectRatio: '2560 / 1213'
                },
                {
                    src: 'assets/image/projects/iscream/04-dinein.png',
                    caption: 'Dine-in sleeve box with a spoon slot, plus stacked cups',
                    label: 'Dine-In Structure',
                    bg: '#283eb0',
                    aspectRatio: '2560 / 1213'
                },
                {
                    src: 'assets/image/projects/iscream/05-takeaway.png',
                    caption: 'Takeaway box and enamel pins',
                    label: 'Takeaway & Pins',
                    bg: '#f0f1f4',
                    aspectRatio: '2560 / 1213'
                }
            ],
            tags: ['Branding', 'Packaging', 'Typography', 'Illustration'],
            pdfUrl: 'https://drive.google.com/file/d/1RuwDVU87-ge6eXjJFRf4aFyv4h2Ct_Vc/view?usp=sharing',
            pdfLabel: 'View Progress Book (PDF) &nearr;',
            descHtml: `
                <div class="case-story-block">
                    <div class="case-quote-banner">
                        "Onion ice cream is a weird idea. I wanted the branding to own that instead of hiding it."
                    </div>

                                        <div class="case-doc-card">
                        <div class="case-doc-icon-wrap" aria-hidden="true">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                <line x1="16" y1="17" x2="8" y2="17"></line>
                                <polyline points="10 9 9 9 8 9"></polyline>
                            </svg>
                        </div>
                        <div class="case-doc-text">
                            <div class="case-doc-meta">DKV &times; FOOD TECH UPH COLLAB // PROGRESS BOOK</div>
                            <div class="case-doc-title">I Scream Progress Book</div>
                            <p class="case-doc-desc">My sketches, mascot drafts, type experiments, and packaging dielines, all in one place.</p>
                        </div>
                        <a href="https://drive.google.com/file/d/1RuwDVU87-ge6eXjJFRf4aFyv4h2Ct_Vc/view?usp=sharing" target="_blank" rel="noopener noreferrer" class="case-doc-btn">
                            <span>Read PDF &nearr;</span>
                        </a>
                    </div>

                    <div class="case-point-card">
                        <div class="case-point-header">
                            <span class="case-point-title">01. The Brief</span>
                            <span class="case-point-timing">The Collab</span>
                        </div>
                        <div class="case-point-body">
                            <p>This started as a collab between <a href="https://www.instagram.com/dkv.uph/" target="_blank" rel="noopener noreferrer" class="case-inline-link"><strong>UPH DKV (@dkv.uph)</strong></a> and <a href="https://www.instagram.com/foodtechuph/" target="_blank" rel="noopener noreferrer" class="case-inline-link"><strong>UPH Food Technology (@foodtechuph)</strong></a>. Each design student was paired with a food tech student, and together we had to build a brand and packaging around a product the food tech side had developed. My partner&#39;s product was easily the strangest one in the class: a plant-based <em>Onion Ice Cream</em> made with real caramelized onions.</p>
                            <p>Most people flinch when they hear &quot;onion&quot; and &quot;ice cream&quot; in the same sentence, and my partner was worried about that too. At first they suggested we play the onion down and just sell it as a healthy vegan dessert. I was more curious about the opposite. What if the branding was upfront about the onion and made it fun, so people would want to try it instead of avoiding it?</p>
                        </div>
                    </div>

                    <div class="case-point-card">
                        <div class="case-point-header">
                            <span class="case-point-title">02. Research &amp; Ideas</span>
                            <span class="case-point-timing">Breaking the Vegan Look</span>
                        </div>
                        <div class="case-point-body">
                            <p>When I looked at healthy and vegan products on the shelf, almost all of them looked the same: lots of white space, muted earthy colors, little leaf icons, and quiet, serious type. I kept asking myself why healthy food always has to look so careful. Ice cream is supposed to be fun. You eat it because it makes you happy.</p>
                            <p>So I went the other way and made it loud, colorful, and full of characters. The name <strong class="case-highlight-pill">I Scream</strong> comes from the old rhyme, turned into <em>&quot;I Scream from Joy!&quot;</em> I drew a family of continuous-line mascots, one for each flavor: Caramelized Onion, Avocado, Ube, Banana, and Strawberry. Once the onion had a face and a personality, it felt a lot less scary, and honestly kind of cute.</p>
                        </div>
                    </div>

                    <div class="case-point-card">
                        <div class="case-point-header">
                            <span class="case-point-title">03. The Design System</span>
                            <span class="case-point-timing">Type, Color &amp; Packaging</span>
                        </div>
                        <div class="case-point-body">
                            <p>For the type, I used a bubbly, puffy display font that looks like soft-serve spilling over the cup, and paired it with a clean sans serif for the nutrition info so it stays easy to read. The main color is a deep royal blue (<code>#1b387a</code>). I picked it partly because it&#39;s the opposite of the beige you see on most vegan packaging, and the colorful letters and mascot badges really pop against it.</p>
                            <p>For the packaging, I made to-go cups with a typographic wrap and a mascot seal for each flavor, a dine-in sleeve carton with a slot for a wooden spoon (so no plastic cutlery needed), and a sturdy magnetic box for takeaway that keeps the ice cream cold and works as a gift box too.</p>
                        </div>
                    </div>

                    <div class="case-point-card">
                        <div class="case-point-header">
                            <span class="case-point-title">04. What I Made &amp; Learned</span>
                            <span class="case-point-timing">Looking Back</span>
                        </div>
                        <div class="case-point-body">
                            <p>The final set includes five flavor cup wraps with nutrition labels, the dine-in carton with the spoon slot, the magnetic takeaway box, enamel pins, and physical prototypes.</p>
                            <p>Everything from my first mascot doodles and type tests to the dielines and mockups is in the <a href="https://drive.google.com/file/d/1RuwDVU87-ge6eXjJFRf4aFyv4h2Ct_Vc/view?usp=sharing" target="_blank" rel="noopener noreferrer" class="case-inline-link"><strong>I Scream Progress Book (PDF) &nearr;</strong></a>.</p>
                            <p>The biggest thing I took away from this project is that you don&#39;t have to hide the weird part of a product. If you&#39;re honest about it and give it some personality, it can end up being the thing people remember.</p>
                        </div>
                    </div>
                </div>
            `,
            liveUrl: '#',
            repoUrl: '#'
        },
        'proj-2': {
            exhibit: 'EXHIBIT #02',
            categoryStamp: 'ILLUSTRATION // LAYOUT',
            category: 'illustration',
            year: 'CASE // 2025',
            title: 'Ballad of Venice',
            subtitle: 'Illustrated Travel Campaign & Print Pieces',
            caption: 'Ballad of Venice: an illustrated travel campaign',
            role: 'Illustrator, Editorial & Collateral Designer',
            timeline: '4 Weeks • Visual Narrative & Layout (UPH DKV, 2025)',
            deliverables: 'Key Visual Poster, Pop-Up 3D Brochure, Die-Cut Travel Guide, Sticker Designs, Monogram & Bookmark Set',
            tools: 'Adobe Illustrator, Adobe Photoshop, and Adobe InDesign',
            themeBg: 'linear-gradient(145deg, #24100d 0%, #4a2119 50%, #7d3b2c 100%)',
            coverImage: 'assets/image/projects/venice/cover.png',
            images: [
                {
                    src: 'assets/image/projects/venice/01-logo.png',
                    caption: 'Gothic arch monogram and Venice seals',
                    label: 'Monogram & Identity',
                    bg: '#24100d',
                    aspectRatio: '7917 / 3750'
                },
                {
                    src: 'assets/image/projects/venice/02-poster.png',
                    caption: 'Key visual poster: "See Italy the way the sun does, from every angle"',
                    label: 'Campaign Poster',
                    bg: '#1d1816',
                    aspectRatio: '4179 / 6250'
                },
                {
                    src: 'assets/image/projects/venice/03-postermockup.png',
                    caption: 'The poster on a street billboard (mockup)',
                    label: 'Street Billboard',
                    bg: '#200e06',
                    aspectRatio: '7917 / 3750'
                },
                {
                    src: 'assets/image/projects/venice/04-brochure.png',
                    caption: 'Tri-fold travel guide and map with a die-cut arch window',
                    label: 'Travel Brochure',
                    bg: '#f6f4ee',
                    aspectRatio: '7917 / 3750'
                },
                {
                    src: 'assets/image/projects/venice/05-bookmarkstickers.png',
                    caption: 'Die-cut column bookmarks and travel stickers',
                    label: 'Bookmarks & Stickers',
                    bg: '#e5cab3',
                    aspectRatio: '7917 / 3750'
                }
            ],
            tags: ['Illustration', 'Typography', 'Layout', 'Branding'],
            descHtml: `
                <div class="case-story-block">
                    <div class="case-quote-banner">
                        "See Italy the way the sun does, from every angle."
                    </div>

                    <div class="case-point-card">
                        <div class="case-point-header">
                            <span class="case-point-title">01. The Brief</span>
                            <span class="case-point-timing">Why Venice</span>
                        </div>
                        <div class="case-point-body">
                            <p>I&#39;ve always been drawn to how old European cities get shown to tourists. Most of the Venice travel material I found used the same bright, oversaturated postcard photos. They&#39;re pretty, but they flatten the city and leave out what actually makes it special: the reflections on the canals, the worn old buildings, and the centuries of history behind its <a href="https://whc.unesco.org/en/list/394/" target="_blank" rel="noopener noreferrer" class="case-inline-link"><strong>UNESCO World Heritage listing for Venice and its Lagoon</strong></a>.</p>
                            <p>I wanted to try something softer and more personal. Instead of a checklist of landmarks, I wanted to tell Venice like a story through illustration and layout, with its warm light, old stone, and slow, dreamy mood.</p>
                        </div>
                    </div>

                    <div class="case-point-card">
                        <div class="case-point-header">
                            <span class="case-point-title">02. Research &amp; Story</span>
                            <span class="case-point-timing">Where the Idea Came From</span>
                        </div>
                        <div class="case-point-body">
                            <p>The name comes from the <a href="https://en.wikipedia.org/wiki/Ballad" target="_blank" rel="noopener noreferrer" class="case-inline-link"><strong>ballad</strong></a>, an old storytelling form in European poetry. I also read parts of Lord Byron&#39;s <a href="https://www.poetryfoundation.org/poems/43844/childe-harolds-pilgrimage-canto-iv-excerpt" target="_blank" rel="noopener noreferrer" class="case-inline-link"><strong>Childe Harold&#39;s Pilgrimage</strong></a>, where he writes about Venice as a floating, half-dreamlike place full of nostalgia. That got me thinking about the bridges, palazzos, and canals as verses in one long poem instead of separate stops on a map.</p>
                            <p>The main visual idea came from the <a href="https://en.wikipedia.org/wiki/Venetian_Gothic_architecture" target="_blank" rel="noopener noreferrer" class="case-inline-link"><strong>Venetian Gothic ogee arch</strong></a>, which John Ruskin writes about in <a href="https://en.wikipedia.org/wiki/The_Stones_of_Venice_(book)" target="_blank" rel="noopener noreferrer" class="case-inline-link"><strong>The Stones of Venice</strong></a>. I used the arch as a window that frames each scene, like you&#39;re peeking into the city through it. In the key visual, the lines of the bridges and gondolas all lead toward a glowing sun in the middle, which gives the whole thing a warm, romantic feel and pulls your eye in.</p>
                        </div>
                    </div>

                    <div class="case-point-card">
                        <div class="case-point-header">
                            <span class="case-point-title">03. The Design System</span>
                            <span class="case-point-timing">Type &amp; Color</span>
                        </div>
                        <div class="case-point-body">
                            <p>I used four typefaces, each with its own job. <em>Aabak Swash Bold</em> is the dramatic headline font, and its swashes remind me of ripples on the water. <em>Charmonman Bold</em> is a cursive that feels like a handwritten travel letter. <em>Feltro Eroded</em> looks like notes scribbled in a sketchbook. And a plain sans serif keeps the itinerary and small text easy to read.</p>
                            <p>The colors come straight from the city: terracotta brick (<code>#7d3b2c</code>), dark espresso brown (<code>#24100d</code>), golden sunset amber, and faded canal turquoise.</p>
                        </div>
                    </div>

                    <div class="case-point-card">
                        <div class="case-point-header">
                            <span class="case-point-title">04. What I Made &amp; Learned</span>
                            <span class="case-point-timing">Looking Back</span>
                        </div>
                        <div class="case-point-body">
                            <p>The final pieces are a key visual poster, a pop-up 3D brochure, a tri-fold travel guide with a die-cut Gothic arch window, sticker designs, a street billboard mockup, ticket slips, and a set of die-cut bookmarks.</p>
                            <p>This project showed me how much research can feed into a design. Reading the poems and learning about the architecture gave me ideas I never would have gotten from just looking at photos of Venice.</p>
                        </div>
                    </div>
                </div>
            `,
            liveUrl: '#',
            repoUrl: '#'
        },
        'proj-3': {
            exhibit: 'EXHIBIT #03',
            categoryStamp: 'LAYOUT // TYPOGRAPHY',
            category: 'layout',
            year: 'CASE // 2025',
            title: 'The Arts & Craft of Tea',
            subtitle: 'Hardcover Book Design & Layout',
            caption: 'The Arts & Craft of Tea: hardcover book design',
            role: 'Publication Editorial Designer & Typographer',
            timeline: '4 Weeks • Editorial & Publication Design (UPH DKV, 2025)',
            deliverables: 'Case-Bound Hardcover, Dust Jacket Spread, 6 Editorial Layout Spreads',
            tools: 'Adobe InDesign, Illustrator, Photoshop',
            themeBg: 'linear-gradient(145deg, #324a3a 0%, #496852 50%, #769a7c 100%)',
            coverImage: 'assets/image/projects/teabook/cover.png',
            images: [
                {
                    src: 'assets/image/projects/teabook/01-bookcover.png',
                    caption: 'Dust jacket and spine mockup, layout by Melia Winisa',
                    label: 'Jacket Spread',
                    bg: '#b5c9a9',
                    aspectRatio: '6713 / 3750'
                },
                {
                    src: 'assets/image/projects/teabook/02-table-of-contents.png',
                    caption: 'Table of contents spread with flowing tea steam graphics and hand-held page turn mockup',
                    label: 'Table of Contents',
                    bg: '#c2cfb8',
                    aspectRatio: '6713 / 4420'
                },
                {
                    src: 'assets/image/projects/teabook/03-spread-01.png',
                    caption: 'Chapter spread "Tea and Its Origin" with historic Chinese paintings (Spread 1)',
                    label: 'Spread 01',
                    bg: '#f1f5d9',
                    aspectRatio: '6713 / 4790'
                },
                {
                    src: 'assets/image/projects/teabook/04-spread-02.png',
                    caption: 'Spread on the tea trade by sea, with vintage lithographs (Spread 2)',
                    label: 'Spread 02',
                    bg: '#f1f5d9',
                    aspectRatio: '6713 / 4790'
                },
                {
                    src: 'assets/image/projects/teabook/05-spread-03.png',
                    caption: 'Full-page Victorian "Afternoon Tea" illustration (Spread 3)',
                    label: 'Spread 03',
                    bg: '#e2e4e2',
                    aspectRatio: '6713 / 4790'
                }
            ],
            tags: ['Layout', 'Typography', 'Illustration'],
            descHtml: `
                <div class="case-story-block">
                    <div class="case-quote-banner">
                        "An enthusiast&#39;s guide to selecting, brewing, and serving exquisite tea. Book design &amp; layout by Melia Winisa."
                    </div>

                    <div class="case-point-card">
                        <div class="case-point-header">
                            <span class="case-point-title">01. The Brief</span>
                            <span class="case-point-timing">The Book</span>
                        </div>
                        <div class="case-point-body">
                            <p>For this project, I designed the layout for Joseph Wesley Uhl&#39;s <a href="https://books.google.co.id/books/about/The_Art_and_Craft_of_Tea.html?hl=id&id=kf_6CwAAQBAJ&redir_esc=y" target="_blank" rel="noopener noreferrer" class="case-inline-link"><strong>The Art and Craft of Tea: An Enthusiast&#39;s Guide to Selecting, Brewing, and Serving Exquisite Tea</strong></a>. While looking at other tea books for reference, I noticed most of them fall into one of two camps. They&#39;re either dense and text-heavy, which makes them hard to get into, or they&#39;re pretty coffee-table books that look nice but don&#39;t say much.</p>
                            <p>I wanted this one to sit somewhere in between, keeping all of Uhl&#39;s history and botany while still being a pleasure to read. Most of all, I wanted the book to feel peaceful and serene. Drinking tea is a slow, calming ritual, and I wanted flipping through the pages to feel the same way. So the real challenge was pacing, color, and type: how do I fit centuries of tea history into one hardcover without it ever feeling rushed or crowded?</p>
                        </div>
                    </div>

                    <div class="case-point-card">
                        <div class="case-point-header">
                            <span class="case-point-title">02. Research &amp; Structure</span>
                            <span class="case-point-timing">Gathering the Visuals</span>
                        </div>
                        <div class="case-point-body">
                            <p>I worked from the history and botany chapters in <a href="https://books.google.co.id/books/about/The_Art_and_Craft_of_Tea.html?hl=id&id=kf_6CwAAQBAJ&redir_esc=y" target="_blank" rel="noopener noreferrer" class="case-inline-link"><strong>The Art and Craft of Tea</strong></a> and went digging for old artwork to go with them. I collected Qing Dynasty Chinese paintings, 18th-century botanical engravings of <em>Camellia sinensis</em>, and Victorian tea illustrations, and looked at how each era drew and recorded tea in its own way.</p>
                            <p>To tie all these different images together, I split the book into three parts: how tea was first grown and harvested, how it traveled the world through trade, and how people enjoy it today. I also made watercolor the theme of the whole book. Soft, see-through washes of color and wide margins give the serif type and old illustrations room to sit together quietly, a bit like tea leaves steeping in warm water.</p>
                        </div>
                    </div>

                    <div class="case-point-card">
                        <div class="case-point-header">
                            <span class="case-point-title">03. Grid, Type &amp; Color</span>
                            <span class="case-point-timing">Keeping It Calm</span>
                        </div>
                        <div class="case-point-body">
                            <p>Almost every choice I made was about keeping things calm. I skipped stark white pages and went with soft pastels instead: mostly sage green, with warm parchment cream and light matcha washes. Sage green is the main color because it&#39;s earthy and relaxing, and it connects the green of tea fields with the quiet of sitting down with a cup. It&#39;s also easy on the eyes, so you can read for a long time without it feeling harsh.</p>
                            <p>The watercolor runs through the whole book. Hand-painted gradients, ribbons of tea steam, and soft color stains show up on chapter openers, in the margins, and between sections, almost like tea spreading through water. For type, <em>Warbler Banner</em> is the heading font, and its tall, wavy strokes remind me of rising steam. <em>Contralto</em> handles the chapter titles, and a light multi-column grid leaves plenty of space around both the text and the pictures.</p>
                        </div>
                    </div>

                    <div class="case-point-card">
                        <div class="case-point-header">
                            <span class="case-point-title">04. What I Made &amp; Learned</span>
                            <span class="case-point-timing">Looking Back</span>
                        </div>
                        <div class="case-point-body">
                            <p>The final pieces are a case-bound hardcover mockup with a linen texture, the full dust jacket and spine, an illustrated table of contents with swirling tea steam, and six double-page chapter spreads.</p>
                            <p>This was my first time really digging into editorial design, and I learned a lot about grids and picking the right images. It also showed me how much one consistent mood, like the soft watercolor here, can change the way a book feels to read.</p>
                        </div>
                    </div>
                </div>
            `,
            liveUrl: '#',
            repoUrl: '#'
        },
        'proj-4': {
            exhibit: 'EXHIBIT #04',
            categoryStamp: 'BRANDING // PACKAGING',
            category: 'branding',
            year: 'CASE // 2026',
            title: 'Lion Air Rebranding',
            subtitle: 'Concept Airline Rebrand & Livery',
            caption: 'Lion Air: a concept airline rebrand',
            role: 'Visual Identity & Brand System Designer',
            timeline: '5 Weeks • Rebranding & Brand Guidelines Study (UPH DKV, 2026)',
            deliverables: 'Main Logo Redesign (Logogram & Logotype), 3 Sub-Brand Logos (Airload, Skycafe, Golden Wings), Aircraft Livery Design, Graphic Standards Manual (GSM), Website Landing Page Design, Flight Tickets, Luggage Tags, VIP Membership Cards, Staff ID Cards & Lanyards, In-Flight Food & Drink Packaging, Posters, Keychains & Pin Designs',
            tools: 'Adobe Illustrator, Adobe Photoshop, and Adobe InDesign',
            themeBg: 'linear-gradient(145deg, #182b6b 0%, #2e4ea8 50%, #689fe0 100%)',
            coverImage: 'assets/image/projects/lionair/cover.png',
            images: [
                {
                    src: 'assets/image/projects/lionair/01-logo.png',
                    caption: 'New logo: the Winged Lion (Singa Bersayap) and a softer wordmark',
                    label: 'Main Logo Redesign',
                    bg: '#182b6b',
                    aspectRatio: '7917 / 3750'
                },
                {
                    src: 'assets/image/projects/lionair/02-website.png',
                    caption: 'Redesigned flight booking website',
                    label: 'Web Platform',
                    bg: '#eef4fa',
                    aspectRatio: '5328 / 3750'
                },
                {
                    src: 'assets/image/projects/lionair/03-posters.png',
                    caption: 'Route posters for destinations around Indonesia',
                    label: 'Route Posters',
                    bg: '#f4f6fa',
                    aspectRatio: '7917 / 3750'
                },
                {
                    src: 'assets/image/projects/lionair/04-skycafe.png',
                    caption: 'Skycafe: in-flight meal boxes, snacks, and drink packaging',
                    label: 'Skycafe In-Flight',
                    bg: '#f4f6fa',
                    aspectRatio: '7917 / 3750'
                },
                {
                    src: 'assets/image/projects/lionair/05-airload.png',
                    caption: 'Airload: cargo branding, waybills, and container graphics',
                    label: 'Airload Cargo',
                    bg: '#f4f6fa',
                    aspectRatio: '7917 / 3750'
                },
                {
                    src: 'assets/image/projects/lionair/06-goldenwings.png',
                    caption: 'Golden Wings: frequent flyer membership cards',
                    label: 'Golden Wings Club',
                    bg: '#f4f6fa',
                    aspectRatio: '7917 / 3750'
                },
                {
                    src: 'assets/image/projects/lionair/07-tickets.png',
                    caption: 'Boarding passes, luggage tags, staff ID cards, and lanyards',
                    label: 'Tickets & ID Cards',
                    bg: '#f4f6fa',
                    aspectRatio: '7917 / 3750'
                }
            ],
            tags: ['Branding', 'Packaging', 'Typography', 'Layout'],
            descHtml: `
                <div class="case-story-block">
                    <div class="case-quote-banner">
                        "Rethinking Lion Air&#39;s identity so it feels calm, trustworthy, and modern."
                    </div>

                    <div class="case-point-card">
                        <div class="case-point-header">
                            <span class="case-point-title">01. The Brief</span>
                            <span class="case-point-timing">Why Lion Air</span>
                        </div>
                        <div class="case-point-body">
                            <p>I&#39;ve always found airline design interesting because flying is stressful for a lot of people, and what they see at the airport can either calm them down or make it worse. <a href="https://www.lionair.co.id/" target="_blank" rel="noopener noreferrer" class="case-inline-link"><strong>Lion Air</strong></a> (<a href="https://www.instagram.com/lionairgroup/" target="_blank" rel="noopener noreferrer" class="case-inline-link"><strong>@lionairgroup</strong></a>) is Southeast Asia&#39;s largest private airline and flies millions of people around Indonesia every day, but its reputation hasn&#39;t been great. People tend to connect it with delays, operational problems, and safety concerns.</p>
                            <p>On top of that, its visual identity had barely changed in decades. Red usually stands for courage and energy, which makes sense on paper. But for an airline people already don&#39;t fully trust, all that bright red can backfire. In a busy terminal it reads more like danger, warning signs, and alarms, which is the last thing a nervous passenger needs before boarding.</p>
                        </div>
                    </div>

                    <div class="case-point-card">
                        <div class="case-point-header">
                            <span class="case-point-title">02. Research &amp; Strategy</span>
                            <span class="case-point-timing">Rethinking the Brand</span>
                        </div>
                        <div class="case-point-body">
                            <p>So the first big decision was to move away from red completely and go with <strong>blue</strong>. Blue makes people think of clear skies, efficiency, and calm. It feels steady and professional, and it helps passengers feel a bit safer before they even reach the gate.</p>
                            <p>Everything else was built around four feelings I wanted the brand to have: <strong class="case-highlight-pill">Calm</strong>, <strong class="case-highlight-pill">Reassuring</strong>, <strong class="case-highlight-pill">Friendly</strong>, and <strong class="case-highlight-pill">Approachable</strong>. I also redesigned the lion. The old one was a fairly aggressive, literal drawing, so I simplified it into a sleek <strong>Winged Lion Emblem</strong> (<em>Singa Bersayap</em>) made of five upward-sweeping feathers. Each feather stands for something that matters in flying: safety, accurate navigation, connecting the archipelago, warm service, and technology. The new emblem feels hopeful instead of intimidating.</p>
                        </div>
                    </div>

                    <div class="case-point-card">
                        <div class="case-point-header">
                            <span class="case-point-title">03. Design System &amp; GSM</span>
                            <span class="case-point-timing">Type &amp; Color</span>
                        </div>
                        <div class="case-point-body">
                            <p>For the wordmark, I customized <em>Avenir Next Heavy Italic</em>. I softened the curves at the top of the letters so it feels warmer and more welcoming, a nod to Indonesian hospitality, and kept the baseline sharp and straight so it still feels precise and stable.</p>
                            <p>The colors were picked to feel calming: deep navy (<code>#182b6b</code>) for reliability, a bright sky blue for openness, and a soft off-white that gives busy layouts like boarding passes and booking pages some breathing room.</p>
                        </div>
                    </div>

                    <div class="case-point-card">
                        <div class="case-point-header">
                            <span class="case-point-title">04. What I Made &amp; Learned</span>
                            <span class="case-point-timing">Looking Back</span>
                        </div>
                        <div class="case-point-body">
                            <p>I applied the identity across a lot of touchpoints: the main logo (logogram and logotype), three sub-brands (Airload for cargo, Skycafe for in-flight food, and Golden Wings for the loyalty program), the aircraft livery, and a full Graphic Standards Manual (GSM). I also designed a website landing page, flight tickets, luggage tags, VIP membership cards, staff ID cards and lanyards, in-flight food and drink packaging, posters, and merch like pins and keychains.</p>
                            <p>Juggling that many pieces taught me how to turn one simple idea, in this case &quot;make people feel calm&quot;, into rules that actually hold up on everything from a luggage tag to a website.</p>
                        </div>
                    </div>
                </div>
            `,
            liveUrl: '#',
            repoUrl: '#'
        },
        'proj-5': {
            exhibit: 'EXHIBIT #05',
            categoryStamp: 'BRANDING // PACKAGING',
            category: 'branding',
            year: 'CASE // 2025',
            title: 'Winnie',
            subtitle: 'Personal Branding, Mascots & Stationery',
            caption: 'Winnie: my personal brand and stationery',
            role: 'Brand Designer, Illustrator & Typographer',
            timeline: '4 Weeks • Visual Identity & Tactile Stationery (UPH DKV, 2025)',
            deliverables: 'Wordmark Logotype, Winged Jellyfish Index Emblem, Character Mascot Avatar, Bespoke Ribbon Bookmarks, Foil Business Cards, Hardcover Clothe Journal, Branded Envelopes',
            tools: 'Adobe Illustrator, Adobe Photoshop, and Adobe InDesign',
            themeBg: 'linear-gradient(145deg, #7a1f2d 0%, #a82c3f 50%, #d4495e 100%)',
            coverImage: 'assets/image/projects/winnie/cover.png',
            images: [
                {
                    src: 'assets/image/projects/winnie/01-logos.png',
                    caption: 'Script wordmark, winged jellyfish emblem, and character icon',
                    label: 'Logos & Mascots',
                    bg: '#ffffff',
                    aspectRatio: '6713 / 3750'
                },
                {
                    src: 'assets/image/projects/winnie/02-bookmarks.png',
                    caption: 'Ribbon bookmarks and foil business cards',
                    label: 'Bookmarks & Cards',
                    bg: '#f4f4f4',
                    aspectRatio: '6713 / 3750'
                },
                {
                    src: 'assets/image/projects/winnie/03-journal.png',
                    caption: 'Crimson cloth journal with a debossed jellyfish emblem',
                    label: 'Hardcover Journal',
                    bg: '#d9b8b8',
                    aspectRatio: '6713 / 3750'
                },
                {
                    src: 'assets/image/projects/winnie/04-envelope.png',
                    caption: 'Crimson envelope with an emblem seal on the flap',
                    label: 'Branded Envelope',
                    bg: '#f6f4ee',
                    aspectRatio: '6713 / 3750'
                }
            ],
            tags: ['Branding', 'Packaging', 'Layout', 'Illustration'],
            descHtml: `
                <div class="case-story-block">
                    <div class="case-quote-banner">
                        "A personal brand that feels like me: a little whimsical, and made to be held."
                    </div>

                    <div class="case-point-card">
                        <div class="case-point-header">
                            <span class="case-point-title">01. The Brief</span>
                            <span class="case-point-timing">Branding Myself</span>
                        </div>
                        <div class="case-point-body">
                            <p>A lot of designers&#39; personal brands go for clean, geometric minimalism. It looks professional, but the person behind it often gets lost. For <em>Winnie</em>, I wanted an identity that still looks polished but shows my playful side, my curiosity, and how much I love stationery.</p>
                            <p>I also wanted it to work on screen and in real life, so I turned it into things you can actually hold: bookmarks, envelopes, foil business cards, and a cloth-bound journal.</p>
                        </div>
                    </div>

                    <div class="case-point-card">
                        <div class="case-point-header">
                            <span class="case-point-title">02. Mascots &amp; Symbols</span>
                            <span class="case-point-timing">Two Characters</span>
                        </div>
                        <div class="case-point-body">
                            <p>The identity has two mascots. The first is a <em>Winged Jellyfish</em>, which is the main emblem. To me it&#39;s about going with the flow, dreaming freely, and being curious about the unknown, kind of like the deep ocean itself. Its tentacles and wings make a balanced, crest-like shape that looks really nice pressed into a seal.</p>
                            <p>The second is an illustrated character: a girl with big round glasses and curly hair, which is basically a little self-portrait. She&#39;s there for the more casual, friendly side of the brand.</p>
                        </div>
                    </div>

                    <div class="case-point-card">
                        <div class="case-point-header">
                            <span class="case-point-title">03. Type &amp; Color</span>
                            <span class="case-point-timing">Script &amp; Crimson</span>
                        </div>
                        <div class="case-point-body">
                            <p>The main logo is a cursive script with strong thick-and-thin contrast, curly swashes, and a tiny winged sparkle at the end. It has a bit of old-book charm but still feels clean and current.</p>
                            <p>The colors are a deep crimson (<code>#a82c3f</code>), a soft blush pink (<code>#f6c9d2</code>), and a warm ivory. I wanted them to remind you of leather book covers, sealing wax, and nice letter paper.</p>
                        </div>
                    </div>

                    <div class="case-point-card">
                        <div class="case-point-header">
                            <span class="case-point-title">04. What I Made &amp; Learned</span>
                            <span class="case-point-timing">Looking Back</span>
                        </div>
                        <div class="case-point-body">
                            <p>I turned the identity into a full stationery set: woven ribbon bookmarks with silk tassels, business cards with painted edges and a ribbon pattern, a hardcover sketchbook in crimson bookcloth, and envelopes with a debossed seal on the flap.</p>
                            <p>This project got me hands-on with small-batch printing and choosing paper by how it feels. It also helped me figure out what my own illustration style looks like once it becomes a brand.</p>
                        </div>
                    </div>
                </div>
            `,
            liveUrl: '#',
            repoUrl: '#'
        },
        'proj-6': {
            exhibit: 'EXHIBIT #06',
            categoryStamp: 'BRANDING // PACKAGING',
            category: 'branding',
            year: 'CASE // 2025',
            title: 'Lunar Crescent',
            subtitle: 'Visual Identity, Character Cards & Merch Packaging',
            caption: 'Lunar Crescent: identity and merch concept',
            role: 'Graphic Designer, Packaging Artist & Illustrator',
            timeline: '4 Weeks • Identity & Collectibles Design (UPH DKV, 2025)',
            deliverables: 'Logotype & Astral Starburst Emblem, Collectible Character Photocards (Wen & Mona), Foil-Stamped Card Deck Box, Vinyl Record & CD Packaging, Enamel Pin Badges, Star Journal, Foil Business Cards',
            tools: 'Adobe Illustrator, Adobe Photoshop, and Adobe InDesign',
            themeBg: 'linear-gradient(145deg, #111111 0%, #222222 50%, #444444 100%)',
            coverImage: 'assets/image/projects/lunar/cover.png',
            images: [
                {
                    src: 'assets/image/projects/lunar/01-pins.png',
                    caption: 'Circular enamel pins featuring character portraits and starburst emblems',
                    label: 'Enamel Pins',
                    bg: '#f4f4f4',
                    aspectRatio: '6713 / 3750'
                },
                {
                    src: 'assets/image/projects/lunar/02-cd.png',
                    caption: 'Compact disc and printed sleeve packaging with starburst emblem',
                    label: 'CD',
                    bg: '#ebebeb',
                    aspectRatio: '6713 / 3750'
                },
                {
                    src: 'assets/image/projects/lunar/03-playing-cards.png',
                    caption: 'Character playing cards: "Wen — The Eclipsed One" and "Mona — The Dark Particle"',
                    label: 'Playing Cards',
                    bg: '#e0e0e0',
                    aspectRatio: '6713 / 3750'
                },
                {
                    src: 'assets/image/projects/lunar/04-playing-cards-box.png',
                    caption: 'Illustrated character playing cards with custom tuck box',
                    label: 'Playing Cards Deck Box',
                    bg: '#dcdcdc',
                    aspectRatio: '6713 / 3750'
                },
                {
                    src: 'assets/image/projects/lunar/05-leather-bound-book.png',
                    caption: 'Hardcover leather-bound book with embossed celestial starburst emblem',
                    label: 'Leather-Bound Book',
                    bg: '#808080',
                    aspectRatio: '6713 / 3750'
                },
                {
                    src: 'assets/image/projects/lunar/06-namecard.png',
                    caption: 'Designer name cards with matte monochrome finish & QR code',
                    label: 'Name Cards',
                    bg: '#2b2b2b',
                    aspectRatio: '6713 / 3750'
                }
            ],
            tags: ['Branding', 'Packaging', 'Typography', 'Illustration'],
            descHtml: `
                <div class="case-story-block">
                    <div class="case-quote-banner">
                        "A black-and-white world of stars, mystery, and characters, made into merch you&#39;d want to collect."
                    </div>

                    <div class="case-point-card">
                        <div class="case-point-header">
                            <span class="case-point-title">01. The Brief</span>
                            <span class="case-point-timing">The Idea</span>
                        </div>
                        <div class="case-point-body">
                            <p>A lot of character merch today is really loud: neon colors, stickers everywhere, and not much thought put into type or texture. With <em>Lunar Crescent</em>, I wanted to see if I could make collectible merch feel more refined using only black and white, celestial symbols, and sharp Didone-style type, so that opening it feels a bit like opening a nicely made book.</p>
                            <p>The project covered a lot: packaging dielines, building out the characters and their world, and designing a whole range of physical items, from a black card deck and photocards to vinyl sleeves and foil business cards.</p>
                        </div>
                    </div>

                    <div class="case-point-card">
                        <div class="case-point-header">
                            <span class="case-point-title">02. Worldbuilding &amp; Characters</span>
                            <span class="case-point-timing">Meet Wen &amp; Mona</span>
                        </div>
                        <div class="case-point-body">
                            <p>The world is built around mysterious celestial particles, with two main characters: <em>Wen — The Eclipsed One</em>, who&#39;s quiet, thoughtful, and a little mysterious, and <em>Mona — The Dark Particle</em>, who stands tall in a star-crested mantle. I drew both of them in fine ink line art, focusing on flowing hair, expressive lines, and small celestial details.</p>
                            <p>Everything is tied together by an eight-point starburst emblem with a question mark in the middle. It&#39;s meant to feel like a compass pointing at questions the story hasn&#39;t answered yet, which pulls collectors further into the lore.</p>
                        </div>
                    </div>

                    <div class="case-point-card">
                        <div class="case-point-header">
                            <span class="case-point-title">03. Monochrome &amp; Type</span>
                            <span class="case-point-timing">Black, White &amp; Silver</span>
                        </div>
                        <div class="case-point-body">
                            <p>To keep things dramatic, I stuck to black, white, and grays. Jet black (<code>#111111</code>) works like an empty night sky, while white linework, silver foil, and frosted gradients add depth without using any color at all.</p>
                            <p>The custom wordmark uses tall, narrow Gothic Didone letters with sharp, thorn-like serifs and pointed ends. It feels mystical but still very controlled, and it holds up on everything from album sleeves to collector boxes.</p>
                        </div>
                    </div>

                    <div class="case-point-card">
                        <div class="case-point-header">
                            <span class="case-point-title">04. What I Made &amp; Learned</span>
                            <span class="case-point-timing">Looking Back</span>
                        </div>
                        <div class="case-point-body">
                            <p>The final set includes a die-cut photocard deck box, foil character cards, 12-inch vinyl packaging with a printed disc, round enamel pins, a hardcover notebook embossed with the star motif, and business cards with a QR code.</p>
                            <p>Lunar Crescent pushed me to make merch prototypes that look close to the real thing and to keep the characters consistent across every piece. It also proved to me that black and white on its own can be just as striking as a full-color design.</p>
                        </div>
                    </div>
                </div>
            `,
            liveUrl: '#',
            repoUrl: '#'
        }
    };

    const projectOrder = ['proj-1', 'proj-2', 'proj-3', 'proj-4', 'proj-5', 'proj-6'];
    let activeProjectIndex = 0;
    let currentGalleryIndex = 0;
    let hoveredNodeId = null;
    let activeFilter = 'all';
    let highestZIndex = 22;

    // ==========================================
    // Subtle Tactile Pin / Yarn Audio Effect
    // ==========================================
    function playPinSound() {
        try {
            const stored = localStorage.getItem('melia_sfx_vol');
            const sfxVol = (stored === null || stored === '28') ? 78 : parseFloat(stored);
            if (sfxVol <= 0.5) return;
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            if (!window._corkAudioCtx) {
                window._corkAudioCtx = new AudioCtx();
            }
            const ctx = window._corkAudioCtx;
            if (ctx.state === 'suspended') ctx.resume();

            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(340, now);
            osc.frequency.exponentialRampToValueAtTime(160, now + 0.055);

            gain.gain.setValueAtTime((sfxVol / 100) * 0.48, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.065);
        } catch (e) { }
    }

    // ==========================================
    // Initialize Pinned Positions on Corkboard
    // ==========================================
    let isCompactBoardLayout = null;
    const compactBoardCoords = {
        'node-hub': { x: 8, y: 1.4 },
        'node-proj-1': { x: 3.5, y: 13.5 },
        'node-proj-2': { x: 52, y: 14 },
        'node-note-left': { x: 5, y: 39.5 },
        'node-note-right': { x: 52.5, y: 39.5 },
        'node-proj-3': { x: 3.5, y: 50.5 },
        'node-proj-4': { x: 52, y: 51 },
        'node-proj-5': { x: 3.5, y: 75.5 },
        'node-proj-6': { x: 52, y: 76 }
    };

    function applyDefaultBoardPositions() {
        const useCompact = window.innerWidth <= 680;
        isCompactBoardLayout = useCompact;
        pinnedItems.forEach((item) => {
            const defRot = parseFloat(item.getAttribute('data-default-rot') || '0');
            if (useCompact && compactBoardCoords[item.id]) {
                item.style.left = `${compactBoardCoords[item.id].x}%`;
                item.style.top = `${compactBoardCoords[item.id].y}%`;
            } else {
                const defX = parseFloat(item.getAttribute('data-default-x') || '10');
                const defY = parseFloat(item.getAttribute('data-default-y') || '10');
                item.style.left = `${defX}%`;
                item.style.top = `${defY}%`;
            }
            item.style.setProperty('--item-rot', `${defRot}deg`);
        });
    }

    // ==========================================
    // Compute Pushpin Coordinates & Render Red Yarn SVG
    // ==========================================
    const svgNS = 'http://www.w3.org/2000/svg';
    const connectionDomElements = [];

    function buildSvgStringElements() {
        stringShadowGroup.innerHTML = '';
        stringMainGroup.innerHTML = '';
        stringFiberGroup.innerHTML = '';
        if (stringKnotGroup) stringKnotGroup.innerHTML = '';
        connectionDomElements.length = 0;

        stringConnections.forEach((conn) => {
            const shadowPath = document.createElementNS(svgNS, 'path');
            shadowPath.setAttribute('class', 'yarn-shadow-path');

            const mainPath = document.createElementNS(svgNS, 'path');
            mainPath.setAttribute('class', 'yarn-main-path');

            const fiberPath = document.createElementNS(svgNS, 'path');
            fiberPath.setAttribute('class', 'yarn-fiber-path');

            const stubStart = document.createElementNS(svgNS, 'line');
            stubStart.setAttribute('class', 'yarn-pin-stub');

            const stubEnd = document.createElementNS(svgNS, 'line');
            stubEnd.setAttribute('class', 'yarn-pin-stub');

            stringShadowGroup.appendChild(shadowPath);
            stringMainGroup.appendChild(mainPath);
            stringFiberGroup.appendChild(fiberPath);
            if (stringKnotGroup) {
                stringKnotGroup.appendChild(stubStart);
                stringKnotGroup.appendChild(stubEnd);
            }

            connectionDomElements.push({
                from: conn.from,
                to: conn.to,
                shadowPath,
                mainPath,
                fiberPath,
                stubStart,
                stubEnd
            });
        });
    }

    function getPinCenterInSurface(nodeId) {
        const pinEl = corkboardSurface.querySelector(`[data-pin-anchor="${nodeId}"]`);
        if (!pinEl) return null;

        const surfaceRect = corkboardSurface.getBoundingClientRect();
        const pinRect = pinEl.getBoundingClientRect();

        return {
            x: pinRect.left - surfaceRect.left + pinRect.width / 2,
            y: pinRect.top - surfaceRect.top + pinRect.height / 2
        };
    }

    function updateRedStrings() {
        if (isCompactBoardLayout !== (window.innerWidth <= 680)) {
            applyDefaultBoardPositions();
        }
        const surfaceRect = corkboardSurface.getBoundingClientRect();
        if (!surfaceRect.width || !surfaceRect.height) return;

        redStringSvg.setAttribute('viewBox', `0 0 ${surfaceRect.width} ${surfaceRect.height}`);
        if (redStringPinSvg) {
            redStringPinSvg.setAttribute('viewBox', `0 0 ${surfaceRect.width} ${surfaceRect.height}`);
        }

        // Cache pin positions
        const pinCoords = {};
        pinnedItems.forEach((item) => {
            const id = item.id;
            if (id) {
                pinCoords[id] = getPinCenterInSurface(id);
            }
        });

        // Update each yarn segment with natural catenary gravity sag
        connectionDomElements.forEach((entry) => {
            const p1 = pinCoords[entry.from];
            const p2 = pinCoords[entry.to];
            if (!p1 || !p2) return;

            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const dist = Math.hypot(dx, dy);

            // Natural downward sag proportional to string length
            const sag = Math.min(52, Math.max(12, dist * 0.095));
            const cx = (p1.x + p2.x) / 2;
            const cy = (p1.y + p2.y) / 2 + sag;

            const pathData = `M ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
            // Shadow sits slightly lower on the corkboard
            const shadowData = `M ${p1.x.toFixed(1)} ${(p1.y + 3).toFixed(1)} Q ${cx.toFixed(1)} ${(cy + 7).toFixed(1)} ${p2.x.toFixed(1)} ${(p2.y + 3).toFixed(1)}`;

            entry.mainPath.setAttribute('d', pathData);
            entry.fiberPath.setAttribute('d', pathData);
            entry.shadowPath.setAttribute('d', shadowData);

            // Short visible yarn tie-off stubs right at each pushpin on the Polaroid top edge
            if (dist > 1) {
                const stubLen = Math.min(13, dist * 0.15);
                const t1x = cx - p1.x;
                const t1y = cy - p1.y;
                const t1Len = Math.hypot(t1x, t1y) || 1;
                entry.stubStart.setAttribute('x1', p1.x.toFixed(1));
                entry.stubStart.setAttribute('y1', p1.y.toFixed(1));
                entry.stubStart.setAttribute('x2', (p1.x + (t1x / t1Len) * stubLen).toFixed(1));
                entry.stubStart.setAttribute('y2', (p1.y + (t1y / t1Len) * stubLen).toFixed(1));

                const t2x = cx - p2.x;
                const t2y = cy - p2.y;
                const t2Len = Math.hypot(t2x, t2y) || 1;
                entry.stubEnd.setAttribute('x1', p2.x.toFixed(1));
                entry.stubEnd.setAttribute('y1', p2.y.toFixed(1));
                entry.stubEnd.setAttribute('x2', (p2.x + (t2x / t2Len) * stubLen).toFixed(1));
                entry.stubEnd.setAttribute('y2', (p2.y + (t2y / t2Len) * stubLen).toFixed(1));
            }

            // Apply hover or filter highlighting
            let isHighlighted = false;
            let isDimmed = false;

            if (hoveredNodeId) {
                if (entry.from === hoveredNodeId || entry.to === hoveredNodeId) {
                    isHighlighted = true;
                } else {
                    isDimmed = true;
                }
            } else if (activeFilter !== 'all') {
                const fromEl = document.getElementById(entry.from);
                const toEl = document.getElementById(entry.to);
                const elMatchesFilter = (el) => {
                    if (!el) return false;
                    const cat = el.getAttribute('data-category') || '';
                    return cat.toLowerCase().split(/\s+/).includes(activeFilter.toLowerCase());
                };
                const fromMatch = elMatchesFilter(fromEl);
                const toMatch = elMatchesFilter(toEl);
                if (fromMatch || toMatch) {
                    isHighlighted = true;
                } else {
                    isDimmed = true;
                }
            }

            entry.mainPath.classList.toggle('is-highlighted', isHighlighted);
            entry.fiberPath.classList.toggle('is-highlighted', isHighlighted);
            entry.mainPath.classList.toggle('is-dimmed', isDimmed);
            entry.fiberPath.classList.toggle('is-dimmed', isDimmed);
            entry.shadowPath.classList.toggle('is-dimmed', isDimmed);
        });
    }

    // ==========================================
    // Hover Connection Tracing
    // ==========================================
    function setHoveredNode(nodeId) {
        hoveredNodeId = nodeId;
        const connectedPeerIds = new Set();

        if (nodeId) {
            stringConnections.forEach((conn) => {
                if (conn.from === nodeId) connectedPeerIds.add(conn.to);
                if (conn.to === nodeId) connectedPeerIds.add(conn.from);
            });
        }

        pinnedItems.forEach((item) => {
            item.classList.toggle('is-connected-peer', connectedPeerIds.has(item.id));
        });

        updateRedStrings();
    }

    pinnedItems.forEach((item) => {
        item.addEventListener('pointerenter', () => {
            setHoveredNode(item.id);
        });
        item.addEventListener('pointerleave', () => {
            if (hoveredNodeId === item.id) {
                setHoveredNode(null);
            }
        });
    });

    // ==========================================
    // Draggable Polaroids & Notes with Live Red String Tracking
    // ==========================================
    pinnedItems.forEach((item) => {
        let isDragging = false;
        let pointerStartX = 0;
        let pointerStartY = 0;
        let itemStartLeft = 0;
        let itemStartTop = 0;
        let movedDistance = 0;
        let animFrameId = null;

        item.addEventListener('pointerdown', (e) => {
            // Allow direct button clicks unless dragged
            if (e.button !== 0) return;

            const surfaceRect = corkboardSurface.getBoundingClientRect();
            const itemRect = item.getBoundingClientRect();

            isDragging = true;
            movedDistance = 0;
            pointerStartX = e.clientX;
            pointerStartY = e.clientY;
            itemStartLeft = itemRect.left - surfaceRect.left;
            itemStartTop = itemRect.top - surfaceRect.top;

            highestZIndex += 1;
            item.style.zIndex = String(Math.min(highestZIndex, 30));
            item.setPointerCapture(e.pointerId);
        });

        item.addEventListener('pointermove', (e) => {
            if (!isDragging) return;

            const dx = e.clientX - pointerStartX;
            const dy = e.clientY - pointerStartY;
            movedDistance = Math.hypot(dx, dy);

            if (movedDistance > 5 && !item.classList.contains('is-dragging')) {
                item.classList.add('is-dragging');
                playPinSound();
            }

            if (movedDistance > 5) {
                const surfaceRect = corkboardSurface.getBoundingClientRect();
                const maxLeft = surfaceRect.width - item.offsetWidth - 8;
                const maxTop = surfaceRect.height - item.offsetHeight - 8;

                const nextLeft = Math.max(8, Math.min(maxLeft, itemStartLeft + dx));
                const nextTop = Math.max(8, Math.min(maxTop, itemStartTop + dy));

                // Convert to percentage so layout stays responsive
                const pctX = (nextLeft / surfaceRect.width) * 100;
                const pctY = (nextTop / surfaceRect.height) * 100;

                item.style.left = `${pctX.toFixed(2)}%`;
                item.style.top = `${pctY.toFixed(2)}%`;

                if (!animFrameId) {
                    animFrameId = requestAnimationFrame(() => {
                        updateRedStrings();
                        animFrameId = null;
                    });
                }
            }
        });

        function finishDrag(e) {
            if (!isDragging) return;
            isDragging = false;
            if (item.hasPointerCapture(e.pointerId)) {
                item.releasePointerCapture(e.pointerId);
            }

            const wasDragged = item.classList.contains('is-dragging') || movedDistance > 5;
            item.classList.remove('is-dragging');
            updateRedStrings();

            if (wasDragged) {
                // Prevent any accidental click event for 400ms after dragging finishes
                item._dragSuppressUntil = Date.now() + 400;
                playPinSound();
            }
        }

        item.addEventListener('pointerup', finishDrag);
        item.addEventListener('pointercancel', finishDrag);

        // Capture phase click interceptor: suppresses accidental clicks on card or any of its children after moving
        item.addEventListener('click', (e) => {
            if (item._dragSuppressUntil && Date.now() < item._dragSuppressUntil) {
                e.stopPropagation();
                e.preventDefault();
                e.stopImmediatePropagation();
            }
        }, true);

        // Keyboard accessibility for Polaroid cards
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                const projectId = item.getAttribute('data-project-id');
                if (projectId) {
                    e.preventDefault();
                    openEvidenceModal(projectId);
                }
            }
        });
    });

    // ==========================================
    // Category Filter Tabs & Board Actions
    // ==========================================
    filterButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            activeFilter = btn.getAttribute('data-filter') || 'all';
            filterButtons.forEach((b) => b.classList.toggle('is-active', b === btn));

            polaroidCards.forEach((card) => {
                const cat = card.getAttribute('data-category') || '';
                const catList = cat.toLowerCase().split(/\s+/);
                const matches = activeFilter === 'all' || catList.includes(activeFilter.toLowerCase());
                card.classList.toggle('is-filtered-out', !matches);
            });

            playPinSound();
            updateRedStrings();
        });
    });

    if (toggleStringsBtn) {
        toggleStringsBtn.addEventListener('click', () => {
            const isHidden = redStringSvg.classList.toggle('is-hidden');
            if (redStringPinSvg) {
                redStringPinSvg.classList.toggle('is-hidden', isHidden);
            }
            toggleStringsBtn.classList.toggle('is-toggled', !isHidden);
            toggleStringsBtn.textContent = isHidden ? 'Red String: OFF' : 'Red String: ON';
            playPinSound();
        });
    }

    if (resetBoardBtn) {
        resetBoardBtn.addEventListener('click', () => {
            activeFilter = 'all';
            filterButtons.forEach((b) => b.classList.toggle('is-active', b.getAttribute('data-filter') === 'all'));
            polaroidCards.forEach((c) => c.classList.remove('is-filtered-out'));

            applyDefaultBoardPositions();
            playPinSound();

            // Smoothly update strings over the transition duration
            const start = performance.now();
            function syncLoop(now) {
                updateRedStrings();
                if (now - start < 320) {
                    requestAnimationFrame(syncLoop);
                }
            }
            requestAnimationFrame(syncLoop);
        });
    }

    // ==========================================
    // Evidence Lightbox / Inspection Modal Controller
    // ==========================================
    const evidenceModal = document.getElementById('evidenceModal');
    const closeEvidenceModalBtn = document.getElementById('closeEvidenceModal');
    const modalExhibitBadge = document.getElementById('modalExhibitBadge');
    const modalPhotoArea = document.getElementById('modalPhotoArea');
    const modalMainPhoto = document.getElementById('modalMainPhoto');
    const modalPlaceholderBox = document.getElementById('modalPlaceholderBox');
    const modalGalleryStrip = document.getElementById('modalGalleryStrip');
    const modalGalleryThumbnails = document.getElementById('modalGalleryThumbnails');
    const modalGalleryCount = document.getElementById('modalGalleryCount');
    const modalPolaroidCaption = document.getElementById('modalPolaroidCaption');
    const modalCategoryStamp = document.getElementById('modalCategoryStamp');
    const modalCaseYear = document.getElementById('modalCaseYear');
    const modalProjectTitle = document.getElementById('modalProjectTitle');
    const modalProjectSubtitle = document.getElementById('modalProjectSubtitle');
    const modalTimeline = document.getElementById('modalTimeline');
    const modalDeliverables = document.getElementById('modalDeliverables');
    const modalTools = document.getElementById('modalTools');
    const modalProjectDesc = document.getElementById('modalProjectDesc');
    const modalProjectTags = document.getElementById('modalProjectTags');
    const modalContactCta = document.getElementById('modalContactCta');
    const modalPdfBtn = document.getElementById('modalPdfBtn');
    const modalPdfBtnText = document.getElementById('modalPdfBtnText');
    const prevEvidenceBtn = document.getElementById('prevEvidenceBtn');
    const nextEvidenceBtn = document.getElementById('nextEvidenceBtn');
    const modalStepCounter = document.getElementById('modalStepCounter');

    // Dynamically adjust Polaroid photo frame aspect ratio to hug picture dimensions
    function applyPhotoAspectRatio(imgObj) {
        if (!modalPhotoArea) return;
        if (imgObj && imgObj.aspectRatio) {
            modalPhotoArea.style.aspectRatio = imgObj.aspectRatio;
            return;
        }
        if (modalMainPhoto && modalMainPhoto.complete && modalMainPhoto.naturalWidth > 0 && modalMainPhoto.naturalHeight > 0) {
            modalPhotoArea.style.aspectRatio = `${modalMainPhoto.naturalWidth} / ${modalMainPhoto.naturalHeight}`;
        } else if (modalMainPhoto) {
            modalMainPhoto.onload = function () {
                if (modalMainPhoto.naturalWidth > 0 && modalMainPhoto.naturalHeight > 0) {
                    modalPhotoArea.style.aspectRatio = `${modalMainPhoto.naturalWidth} / ${modalMainPhoto.naturalHeight}`;
                }
            };
        }
    }

    function openEvidenceModal(projectId) {
        const data = projectDatabase[projectId];
        if (!data || !evidenceModal) return;

        activeProjectIndex = Math.max(0, projectOrder.indexOf(projectId));
        playPinSound();

        if (modalExhibitBadge) modalExhibitBadge.textContent = data.exhibit;
        if (modalPhotoArea) modalPhotoArea.style.background = data.themeBg;
        if (modalCategoryStamp) modalCategoryStamp.textContent = data.categoryStamp;
        if (modalCaseYear) modalCaseYear.textContent = data.year;
        if (modalProjectTitle) modalProjectTitle.textContent = data.title;
        if (modalProjectSubtitle) modalProjectSubtitle.textContent = data.subtitle;

        // Executive Design Vitals (Timeline, Tools, Deliverables)
        if (modalTimeline) modalTimeline.textContent = data.timeline || 'Academic Studio Project (UPH DKV)';
        if (modalTools) modalTools.textContent = data.tools || 'Adobe Creative Suite';
        if (modalDeliverables) modalDeliverables.textContent = data.deliverables || 'Design Assets & Documentation';

        // Image & Gallery display
        currentGalleryIndex = 0;
        const hasImages = (data.images && data.images.length > 0) || data.coverImage;
        if (hasImages) {
            const firstImg = (data.images && data.images.length > 0) ? data.images[0] : null;
            const initialSrc = firstImg ? firstImg.src : data.coverImage;
            if (modalMainPhoto) {
                modalMainPhoto.src = initialSrc;
                modalMainPhoto.alt = data.title;
                modalMainPhoto.style.objectFit = 'contain';
                modalMainPhoto.hidden = false;
            }
            if (modalPhotoArea) {
                modalPhotoArea.style.background = '#ffffff';
                applyPhotoAspectRatio(firstImg);
            }
            if (modalPolaroidCaption) {
                modalPolaroidCaption.textContent = firstImg ? firstImg.caption : data.caption;
            }
            if (modalPlaceholderBox) modalPlaceholderBox.hidden = true;
        } else {
            if (modalMainPhoto) modalMainPhoto.hidden = true;
            if (modalPlaceholderBox) modalPlaceholderBox.hidden = false;
            if (modalPolaroidCaption) modalPolaroidCaption.textContent = data.caption;
            if (modalPhotoArea) modalPhotoArea.style.aspectRatio = '16 / 11';
        }

        // Render photo gallery strip when project has multiple evidence photos
        if (modalGalleryStrip && modalGalleryThumbnails) {
            if (data.images && data.images.length > 1) {
                modalGalleryStrip.hidden = false;
                if (modalGalleryCount) {
                    modalGalleryCount.textContent = `EVIDENCE PHOTOS (${data.images.length})`;
                }
                modalGalleryThumbnails.innerHTML = '';
                data.images.forEach((imgObj, idx) => {
                    const btn = document.createElement('button');
                    btn.type = 'button';
                    btn.className = `gallery-thumb-btn ${idx === 0 ? 'is-active' : ''}`;
                    btn.title = imgObj.label || imgObj.caption;
                    if (imgObj.aspectRatio) {
                        btn.style.aspectRatio = imgObj.aspectRatio;
                    }
                    const thumbImg = document.createElement('img');
                    thumbImg.src = imgObj.src;
                    thumbImg.alt = imgObj.label || '';
                    thumbImg.className = 'gallery-thumb-img';
                    function syncThumbRatio() {
                        if (thumbImg.naturalWidth && thumbImg.naturalHeight) {
                            btn.style.aspectRatio = `${thumbImg.naturalWidth} / ${thumbImg.naturalHeight}`;
                        }
                    }
                    if (thumbImg.complete && thumbImg.naturalWidth > 0) {
                        syncThumbRatio();
                    } else {
                        thumbImg.onload = syncThumbRatio;
                    }
                    btn.appendChild(thumbImg);
                    btn.addEventListener('click', () => {
                        currentGalleryIndex = idx;
                        modalGalleryThumbnails.querySelectorAll('.gallery-thumb-btn').forEach(b => b.classList.remove('is-active'));
                        btn.classList.add('is-active');
                        applyPhotoAspectRatio(imgObj);
                        if (modalMainPhoto) {
                            modalMainPhoto.style.opacity = '0.35';
                            setTimeout(() => {
                                modalMainPhoto.src = imgObj.src;
                                modalMainPhoto.style.objectFit = 'contain';
                                if (modalPhotoArea) {
                                    modalPhotoArea.style.background = '#ffffff';
                                }
                                applyPhotoAspectRatio(imgObj);
                                modalMainPhoto.style.opacity = '1';
                            }, 80);
                        }
                        if (modalPolaroidCaption) {
                            modalPolaroidCaption.textContent = imgObj.caption;
                        }
                        playPinSound();
                    });
                    modalGalleryThumbnails.appendChild(btn);
                });
            } else {
                modalGalleryStrip.hidden = true;
                modalGalleryThumbnails.innerHTML = '';
            }
        }

        // Description / Case Breakdown
        if (data.descHtml) {
            if (modalProjectDesc) modalProjectDesc.innerHTML = data.descHtml;
        } else {
            if (modalProjectDesc) modalProjectDesc.textContent = data.desc || '';
        }

        if (modalProjectTags) {
            modalProjectTags.innerHTML = '';
            data.tags.forEach((tag) => {
                const span = document.createElement('span');
                span.className = 'modal-tag-pill';
                span.textContent = tag;
                modalProjectTags.appendChild(span);
            });
        }

        // PDF Documentation / Progress Book Action Button (Strictly for I Scream / projects with explicit pdfUrl)
        if (modalPdfBtn) {
            if (data.pdfUrl) {
                modalPdfBtn.href = data.pdfUrl;
                modalPdfBtn.hidden = false;
                modalPdfBtn.style.display = 'inline-flex';
                if (modalPdfBtnText) {
                    modalPdfBtnText.innerHTML = data.pdfLabel || 'View Progress Book (PDF) &nearr;';
                }
            } else {
                modalPdfBtn.hidden = true;
                modalPdfBtn.style.display = 'none';
                modalPdfBtn.removeAttribute('href');
            }
        }

        if (modalStepCounter) {
            modalStepCounter.textContent = `0${activeProjectIndex + 1} / 0${projectOrder.length}`;
        }

        evidenceModal.hidden = false;
    }

    function closeEvidenceModal() {
        if (!evidenceModal || evidenceModal.hidden) return;
        evidenceModal.hidden = true;
        if (modalPdfBtn) {
            modalPdfBtn.hidden = true;
            modalPdfBtn.style.display = 'none';
            modalPdfBtn.removeAttribute('href');
        }
        playPinSound();
    }

    function stepEvidenceModal(delta) {
        activeProjectIndex = (activeProjectIndex + delta + projectOrder.length) % projectOrder.length;
        openEvidenceModal(projectOrder[activeProjectIndex]);
    }

    if (closeEvidenceModalBtn) {
        closeEvidenceModalBtn.addEventListener('click', closeEvidenceModal);
    }

    if (modalContactCta) {
        modalContactCta.addEventListener('click', () => {
            closeEvidenceModal();
        });
    }

    if (evidenceModal) {
        evidenceModal.addEventListener('click', (e) => {
            if (e.target === evidenceModal) {
                closeEvidenceModal();
            }
        });
    }

    if (prevEvidenceBtn) {
        prevEvidenceBtn.addEventListener('click', () => stepEvidenceModal(-1));
    }

    if (nextEvidenceBtn) {
        nextEvidenceBtn.addEventListener('click', () => stepEvidenceModal(1));
    }

    // ==========================================
    // Full-Size High-Res Image Inspection Lightbox
    // ==========================================
    const fullviewModal = document.getElementById('fullviewModal');
    const fullviewImage = document.getElementById('fullviewImage');
    const fullviewCaption = document.getElementById('fullviewCaption');
    const fullviewCounter = document.getElementById('fullviewCounter');
    const closeFullviewModalBtn = document.getElementById('closeFullviewModal');
    const prevFullviewBtn = document.getElementById('prevFullviewBtn');
    const nextFullviewBtn = document.getElementById('nextFullviewBtn');

    function openFullviewViewer(imgIndex = null) {
        const data = projectDatabase[projectOrder[activeProjectIndex]];
        if (!data || !fullviewModal || !fullviewImage) return;

        const hasImages = (data.images && data.images.length > 0);
        if (hasImages) {
            if (imgIndex !== null) {
                currentGalleryIndex = (imgIndex + data.images.length) % data.images.length;
            }
            const currentImg = data.images[currentGalleryIndex];
            fullviewImage.src = currentImg.src;
            fullviewImage.alt = currentImg.label || data.title;
            if (fullviewCaption) {
                fullviewCaption.textContent = currentImg.caption || `${data.title} — ${currentImg.label}`;
            }
            if (fullviewCounter) {
                fullviewCounter.textContent = `${currentGalleryIndex + 1} / ${data.images.length}`;
            }
            if (prevFullviewBtn) prevFullviewBtn.hidden = (data.images.length <= 1);
            if (nextFullviewBtn) nextFullviewBtn.hidden = (data.images.length <= 1);
        } else {
            const fallbackSrc = data.coverImage || (modalMainPhoto ? modalMainPhoto.src : '');
            if (!fallbackSrc) return;
            fullviewImage.src = fallbackSrc;
            fullviewImage.alt = data.title;
            if (fullviewCaption) fullviewCaption.textContent = data.caption || data.title;
            if (fullviewCounter) fullviewCounter.textContent = '1 / 1';
            if (prevFullviewBtn) prevFullviewBtn.hidden = true;
            if (nextFullviewBtn) nextFullviewBtn.hidden = true;
        }

        fullviewModal.hidden = false;
        playPinSound();
    }

    function closeFullviewViewer() {
        if (!fullviewModal || fullviewModal.hidden) return;
        fullviewModal.hidden = true;
        playPinSound();
    }

    function stepFullviewViewer(delta) {
        const data = projectDatabase[projectOrder[activeProjectIndex]];
        if (!data || !data.images || data.images.length <= 1) return;
        currentGalleryIndex = (currentGalleryIndex + delta + data.images.length) % data.images.length;

        const imgObj = data.images[currentGalleryIndex];
        if (modalMainPhoto) {
            modalMainPhoto.src = imgObj.src;
            modalMainPhoto.style.objectFit = 'contain';
        }
        if (modalPhotoArea) {
            modalPhotoArea.style.background = '#ffffff';
        }
        applyPhotoAspectRatio(imgObj);
        if (modalPolaroidCaption) {
            modalPolaroidCaption.textContent = imgObj.caption;
        }
        if (modalGalleryThumbnails) {
            modalGalleryThumbnails.querySelectorAll('.gallery-thumb-btn').forEach((b, i) => {
                b.classList.toggle('is-active', i === currentGalleryIndex);
            });
        }

        openFullviewViewer();
    }

    if (modalPhotoArea) {
        modalPhotoArea.addEventListener('click', () => {
            openFullviewViewer(currentGalleryIndex);
        });
        modalPhotoArea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openFullviewViewer(currentGalleryIndex);
            }
        });
    }

    if (closeFullviewModalBtn) {
        closeFullviewModalBtn.addEventListener('click', closeFullviewViewer);
    }

    if (fullviewModal) {
        fullviewModal.addEventListener('click', (e) => {
            if (e.target === fullviewModal) {
                closeFullviewViewer();
            }
        });
    }

    if (prevFullviewBtn) {
        prevFullviewBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            stepFullviewViewer(-1);
        });
    }

    if (nextFullviewBtn) {
        nextFullviewBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            stepFullviewViewer(1);
        });
    }

    window.addEventListener('keydown', (e) => {
        if (fullviewModal && !fullviewModal.hidden) {
            if (e.key === 'Escape') {
                closeFullviewViewer();
                return;
            }
            if (e.key === 'ArrowLeft') {
                stepFullviewViewer(-1);
                return;
            }
            if (e.key === 'ArrowRight') {
                stepFullviewViewer(1);
                return;
            }
        }

        if (!evidenceModal || evidenceModal.hidden) return;
        if (e.key === 'Escape') closeEvidenceModal();
        if (e.key === 'ArrowLeft') stepEvidenceModal(-1);
        if (e.key === 'ArrowRight') stepEvidenceModal(1);
    });

    // Explicit click handlers for Inspect Dossier buttons & Polaroid cards
    document.querySelectorAll('.polaroid-inspect-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = btn.closest('.polaroid-card');
            if (card && card._dragSuppressUntil && Date.now() < card._dragSuppressUntil) {
                e.stopPropagation();
                e.preventDefault();
                return;
            }
            e.stopPropagation();
            const projectId = btn.getAttribute('data-open-project');
            if (projectId) {
                openEvidenceModal(projectId);
            }
        });
    });

    document.querySelectorAll('.polaroid-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (card._dragSuppressUntil && Date.now() < card._dragSuppressUntil) {
                e.stopPropagation();
                e.preventDefault();
                return;
            }
            if (card.classList.contains('is-dragging')) return;
            if (e.target.closest('.polaroid-inspect-btn')) return;
            const projectId = card.getAttribute('data-project-id');
            if (projectId && (evidenceModal.hidden || projectOrder[activeProjectIndex] !== projectId)) {
                openEvidenceModal(projectId);
            }
        });
    });

    // Make modal functions globally accessible for testing & integration
    window.openEvidenceModal = openEvidenceModal;
    window.openFullviewViewer = openFullviewViewer;
    window.closeFullviewViewer = closeFullviewViewer;

    // Check deep-link query or hash parameter
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const openParam = urlParams.get('project') || (window.location.hash && window.location.hash.startsWith('#proj-') ? window.location.hash.replace('#', '') : null);
        if (openParam && projectDatabase[openParam]) {
            setTimeout(() => openEvidenceModal(openParam), 250);
        }
    } catch (_) { }

    // ==========================================
    // Boot Corkboard Layout & String Renderer
    // ==========================================
    applyDefaultBoardPositions();
    buildSvgStringElements();

    window.addEventListener('resize', () => {
        requestAnimationFrame(updateRedStrings);
    });

    window.addEventListener('DOMContentLoaded', () => {
        requestAnimationFrame(() => {
            updateRedStrings();
            setTimeout(updateRedStrings, 120);
        });
    });

    requestAnimationFrame(updateRedStrings);

    // Export updateRedStrings for single-page application hash navigation
    window.updateCorkboardStrings = updateRedStrings;
})();
