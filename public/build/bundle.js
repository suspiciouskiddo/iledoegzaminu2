
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.48.0' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/App.svelte generated by Svelte v3.48.0 */

    const file = "src/App.svelte";

    function create_fragment(ctx) {
    	let div9;
    	let ul;
    	let li0;
    	let a0;
    	let div1;
    	let svg0;
    	let path0;
    	let t0;
    	let div0;
    	let span0;
    	let t2;
    	let li1;
    	let div2;
    	let t3;
    	let li2;
    	let a1;
    	let div4;
    	let svg1;
    	let path1;
    	let t4;
    	let div3;
    	let span1;
    	let t6;
    	let li3;
    	let a2;
    	let div6;
    	let svg2;
    	let path2;
    	let t7;
    	let div5;
    	let span2;
    	let t9;
    	let li4;
    	let a3;
    	let div8;
    	let svg3;
    	let path3;
    	let t10;
    	let div7;
    	let span3;
    	let t12;
    	let main;

    	const block = {
    		c: function create() {
    			div9 = element("div");
    			ul = element("ul");
    			li0 = element("li");
    			a0 = element("a");
    			div1 = element("div");
    			svg0 = svg_element("svg");
    			path0 = svg_element("path");
    			t0 = space();
    			div0 = element("div");
    			span0 = element("span");
    			span0.textContent = "ILEDOEGZAMINU.PL";
    			t2 = space();
    			li1 = element("li");
    			div2 = element("div");
    			t3 = space();
    			li2 = element("li");
    			a1 = element("a");
    			div4 = element("div");
    			svg1 = svg_element("svg");
    			path1 = svg_element("path");
    			t4 = space();
    			div3 = element("div");
    			span1 = element("span");
    			span1.textContent = "MATURA";
    			t6 = space();
    			li3 = element("li");
    			a2 = element("a");
    			div6 = element("div");
    			svg2 = svg_element("svg");
    			path2 = svg_element("path");
    			t7 = space();
    			div5 = element("div");
    			span2 = element("span");
    			span2.textContent = "EGZAMIN ÓSMOKLASISTY";
    			t9 = space();
    			li4 = element("li");
    			a3 = element("a");
    			div8 = element("div");
    			svg3 = svg_element("svg");
    			path3 = svg_element("path");
    			t10 = space();
    			div7 = element("div");
    			span3 = element("span");
    			span3.textContent = "WAKACJE 2023";
    			t12 = space();
    			main = element("main");
    			attr_dev(path0, "d", "M352 0C369.7 0 384 14.33 384 32C384 49.67 369.7 64 352 64V74.98C352 117.4 335.1 158.1 305.1 188.1L237.3 256L305.1 323.9C335.1 353.9 352 394.6 352 437V448C369.7 448 384 462.3 384 480C384 497.7 369.7 512 352 512H32C14.33 512 0 497.7 0 480C0 462.3 14.33 448 32 448V437C32 394.6 48.86 353.9 78.86 323.9L146.7 256L78.86 188.1C48.86 158.1 32 117.4 32 74.98V64C14.33 64 0 49.67 0 32C0 14.33 14.33 0 32 0H352zM111.1 128H272C282.4 112.4 288 93.98 288 74.98V64H96V74.98C96 93.98 101.6 112.4 111.1 128zM111.1 384H272C268.5 378.7 264.5 373.7 259.9 369.1L192 301.3L124.1 369.1C119.5 373.7 115.5 378.7 111.1 384V384z");
    			add_location(path0, file, 12, 175, 409);
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "viewBox", "0 0 384 512");
    			attr_dev(svg0, "class", "svg-li-icon svelte-g6og6b");
    			add_location(svg0, file, 8, 5, 134);
    			add_location(span0, file, 17, 6, 1084);
    			attr_dev(div0, "class", "nav-text svelte-g6og6b");
    			add_location(div0, file, 16, 5, 1055);
    			attr_dev(div1, "class", "nav-item-div svelte-g6og6b");
    			add_location(div1, file, 7, 4, 102);
    			attr_dev(a0, "href", "/");
    			set_style(a0, "text-decoration", "none");
    			add_location(a0, file, 6, 3, 54);
    			attr_dev(li0, "class", "svelte-g6og6b");
    			add_location(li0, file, 5, 2, 46);
    			set_style(div2, "height", "50px");
    			add_location(div2, file, 23, 3, 1163);
    			attr_dev(li1, "class", "svelte-g6og6b");
    			add_location(li1, file, 22, 2, 1155);
    			attr_dev(path1, "d", "M0 219.2v212.5c0 14.25 11.62 26.25 26.5 27C75.32 461.2 180.2 471.3 240 511.9V245.2C181.4 205.5 79.99 194.8 29.84 192C13.59 191.1 0 203.6 0 219.2zM482.2 192c-50.09 2.848-151.3 13.47-209.1 53.09C272.1 245.2 272 245.3 272 245.5v266.5c60.04-40.39 164.7-50.76 213.5-53.28C500.4 457.9 512 445.9 512 431.7V219.2C512 203.6 498.4 191.1 482.2 192zM352 96c0-53-43-96-96-96S160 43 160 96s43 96 96 96S352 149 352 96z");
    			add_location(path1, file, 32, 175, 1535);
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "viewBox", "0 0 512 512");
    			attr_dev(svg1, "class", "svg-li-icon svelte-g6og6b");
    			add_location(svg1, file, 28, 5, 1260);
    			add_location(span1, file, 37, 6, 2011);
    			attr_dev(div3, "class", "nav-text svelte-g6og6b");
    			add_location(div3, file, 36, 5, 1982);
    			attr_dev(div4, "class", "nav-item-div svelte-g6og6b");
    			add_location(div4, file, 27, 4, 1228);
    			attr_dev(a1, "href", "/");
    			add_location(a1, file, 26, 3, 1211);
    			attr_dev(li2, "class", "svelte-g6og6b");
    			add_location(li2, file, 25, 2, 1203);
    			attr_dev(path2, "d", "M448 336v-288C448 21.49 426.5 0 400 0H96C42.98 0 0 42.98 0 96v320c0 53.02 42.98 96 96 96h320c17.67 0 32-14.33 32-31.1c0-11.72-6.607-21.52-16-27.1v-81.36C441.8 362.8 448 350.2 448 336zM143.1 128h192C344.8 128 352 135.2 352 144C352 152.8 344.8 160 336 160H143.1C135.2 160 128 152.8 128 144C128 135.2 135.2 128 143.1 128zM143.1 192h192C344.8 192 352 199.2 352 208C352 216.8 344.8 224 336 224H143.1C135.2 224 128 216.8 128 208C128 199.2 135.2 192 143.1 192zM384 448H96c-17.67 0-32-14.33-32-32c0-17.67 14.33-32 32-32h288V448z");
    			add_location(path2, file, 49, 175, 2404);
    			attr_dev(svg2, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg2, "viewBox", "0 0 448 512");
    			attr_dev(svg2, "class", "svg-li-icon svelte-g6og6b");
    			add_location(svg2, file, 45, 5, 2129);
    			add_location(span2, file, 54, 6, 2997);
    			attr_dev(div5, "class", "nav-text svelte-g6og6b");
    			add_location(div5, file, 53, 5, 2968);
    			attr_dev(div6, "class", "nav-item-div svelte-g6og6b");
    			add_location(div6, file, 44, 4, 2097);
    			attr_dev(a2, "href", "/");
    			add_location(a2, file, 43, 3, 2080);
    			attr_dev(li3, "class", "svelte-g6og6b");
    			add_location(li3, file, 42, 2, 2072);
    			attr_dev(path3, "d", "M115.4 136.8l102.1 37.35c35.13-81.62 86.25-144.4 139-173.7c-95.88-4.875-188.8 36.96-248.5 111.7C101.2 120.6 105.2 133.2 115.4 136.8zM247.6 185l238.5 86.87c35.75-121.4 18.62-231.6-42.63-253.9c-7.375-2.625-15.12-4.062-23.12-4.062C362.4 13.88 292.1 83.13 247.6 185zM521.5 60.51c6.25 16.25 10.75 34.62 13.13 55.25c5.75 49.87-1.376 108.1-18.88 166.9l102.6 37.37c10.13 3.75 21.25-3.375 21.5-14.12C642.3 210.1 598 118.4 521.5 60.51zM528 448h-207l65-178.5l-60.13-21.87l-72.88 200.4H48C21.49 448 0 469.5 0 496C0 504.8 7.163 512 16 512h544c8.837 0 16-7.163 16-15.1C576 469.5 554.5 448 528 448z");
    			add_location(path3, file, 62, 254, 3377);
    			attr_dev(svg3, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg3, "viewBox", "0 0 640 512");
    			attr_dev(svg3, "class", "svg-li-icon svelte-g6og6b");
    			add_location(svg3, file, 62, 4, 3127);
    			add_location(span3, file, 64, 5, 4011);
    			attr_dev(div7, "class", "nav-text svelte-g6og6b");
    			add_location(div7, file, 63, 4, 3983);
    			attr_dev(div8, "class", "nav-item-div svelte-g6og6b");
    			add_location(div8, file, 61, 3, 3096);
    			attr_dev(a3, "href", "/");
    			add_location(a3, file, 60, 3, 3080);
    			attr_dev(li4, "class", "svelte-g6og6b");
    			add_location(li4, file, 59, 2, 3072);
    			attr_dev(ul, "class", "svelte-g6og6b");
    			add_location(ul, file, 4, 1, 39);
    			attr_dev(div9, "class", "nav svelte-g6og6b");
    			add_location(div9, file, 3, 0, 20);
    			add_location(main, file, 70, 0, 4084);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div9, anchor);
    			append_dev(div9, ul);
    			append_dev(ul, li0);
    			append_dev(li0, a0);
    			append_dev(a0, div1);
    			append_dev(div1, svg0);
    			append_dev(svg0, path0);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			append_dev(div0, span0);
    			append_dev(ul, t2);
    			append_dev(ul, li1);
    			append_dev(li1, div2);
    			append_dev(ul, t3);
    			append_dev(ul, li2);
    			append_dev(li2, a1);
    			append_dev(a1, div4);
    			append_dev(div4, svg1);
    			append_dev(svg1, path1);
    			append_dev(div4, t4);
    			append_dev(div4, div3);
    			append_dev(div3, span1);
    			append_dev(ul, t6);
    			append_dev(ul, li3);
    			append_dev(li3, a2);
    			append_dev(a2, div6);
    			append_dev(div6, svg2);
    			append_dev(svg2, path2);
    			append_dev(div6, t7);
    			append_dev(div6, div5);
    			append_dev(div5, span2);
    			append_dev(ul, t9);
    			append_dev(ul, li4);
    			append_dev(li4, a3);
    			append_dev(a3, div8);
    			append_dev(div8, svg3);
    			append_dev(svg3, path3);
    			append_dev(div8, t10);
    			append_dev(div8, div7);
    			append_dev(div7, span3);
    			insert_dev(target, t12, anchor);
    			insert_dev(target, main, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div9);
    			if (detaching) detach_dev(t12);
    			if (detaching) detach_dev(main);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
