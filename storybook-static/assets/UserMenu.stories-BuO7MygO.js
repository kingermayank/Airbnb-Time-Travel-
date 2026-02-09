import{j as r}from"./jsx-runtime-D_zvdyIk.js";import{U as k}from"./UserMenu-zY8MeJtX.js";import"./SectionTitle-OUIKQWJq.js";import"./index-BCtMShv3.js";import"./search-De7yGF5O.js";import"./createLucideIcon-CJ_m3CD5.js";const O={title:"Patterns/UserMenu",component:k,tags:["autodocs"],parameters:{layout:"centered",docs:{description:{component:'Account dropdown with menu items (circle icon + label), optional "Become a host" CTA with title/description and image placeholder, and Log out. Image asset for the CTA is left blank by default; you can pass `becomeAHostImageSrc` or add an image later.'}}},decorators:[e=>r.jsx("div",{style:{padding:24},children:r.jsx(e,{})})],argTypes:{menuItems:{control:!1},becomeAHostTitle:{control:"text"},becomeAHostDescription:{control:"text"},becomeAHostImageSrc:{control:"text"},logOutLabel:{control:"text"},onBecomeAHostClick:{action:"becomeAHost"},onLogOutClick:{action:"logOut"}}},c=[{label:"Wishlists"},{label:"What is this?"},{label:"How did I build this?"},{label:"Share"}],o={args:{menuItems:c,becomeAHostTitle:"Become a host",becomeAHostDescription:"Start hosting and earn extra income if you're okay.",logOutLabel:"Log out"},parameters:{docs:{description:{story:"Default menu with Figma copy. Image placeholder is blank for you to add an asset."}}}},t={args:{menuItems:c.map((e,H)=>({...e,onClick:()=>console.log(`Clicked: ${e.label}`)})),becomeAHostTitle:"Become a host",becomeAHostDescription:"Start hosting and earn extra income if you're okay.",onBecomeAHostClick:()=>console.log("Become a host clicked"),onLogOutClick:()=>console.log("Log out clicked"),logOutLabel:"Log out"},parameters:{docs:{description:{story:"All menu items and actions wired to callbacks (see Actions panel)."}}}},s={args:{menuItems:[{label:"Trips"},{label:"Wishlists"},{label:"Account"}],becomeAHostTitle:"Become a host",becomeAHostDescription:"Share your space and earn.",logOutLabel:"Log out"},parameters:{docs:{description:{story:"Custom set of menu items."}}}},a={args:{menuItems:c,becomeAHostTitle:"",becomeAHostDescription:"",logOutLabel:"Log out"},parameters:{docs:{description:{story:'Menu without the "Become a host" block (empty title/description).'}}}};var n,i,l;o.parameters={...o.parameters,docs:{...(n=o.parameters)==null?void 0:n.docs,source:{originalSource:`{
  args: {
    menuItems: defaultItems,
    becomeAHostTitle: 'Become a host',
    becomeAHostDescription: "Start hosting and earn extra income if you're okay.",
    logOutLabel: 'Log out'
  },
  parameters: {
    docs: {
      description: {
        story: 'Default menu with Figma copy. Image placeholder is blank for you to add an asset.'
      }
    }
  }
}`,...(l=(i=o.parameters)==null?void 0:i.docs)==null?void 0:l.source}}};var m,u,d;t.parameters={...t.parameters,docs:{...(m=t.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    menuItems: defaultItems.map((item, i) => ({
      ...item,
      onClick: () => console.log(\`Clicked: \${item.label}\`)
    })),
    becomeAHostTitle: 'Become a host',
    becomeAHostDescription: "Start hosting and earn extra income if you're okay.",
    onBecomeAHostClick: () => console.log('Become a host clicked'),
    onLogOutClick: () => console.log('Log out clicked'),
    logOutLabel: 'Log out'
  },
  parameters: {
    docs: {
      description: {
        story: 'All menu items and actions wired to callbacks (see Actions panel).'
      }
    }
  }
}`,...(d=(u=t.parameters)==null?void 0:u.docs)==null?void 0:d.source}}};var p,g,b;s.parameters={...s.parameters,docs:{...(p=s.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    menuItems: [{
      label: 'Trips'
    }, {
      label: 'Wishlists'
    }, {
      label: 'Account'
    }],
    becomeAHostTitle: 'Become a host',
    becomeAHostDescription: 'Share your space and earn.',
    logOutLabel: 'Log out'
  },
  parameters: {
    docs: {
      description: {
        story: 'Custom set of menu items.'
      }
    }
  }
}`,...(b=(g=s.parameters)==null?void 0:g.docs)==null?void 0:b.source}}};var h,A,y;a.parameters={...a.parameters,docs:{...(h=a.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    menuItems: defaultItems,
    becomeAHostTitle: '',
    becomeAHostDescription: '',
    logOutLabel: 'Log out'
  },
  parameters: {
    docs: {
      description: {
        story: 'Menu without the "Become a host" block (empty title/description).'
      }
    }
  }
}`,...(y=(A=a.parameters)==null?void 0:A.docs)==null?void 0:y.source}}};const T=["Default","WithCallbacks","CustomMenuItems","WithoutBecomeAHost"];export{s as CustomMenuItems,o as Default,t as WithCallbacks,a as WithoutBecomeAHost,T as __namedExportsOrder,O as default};
