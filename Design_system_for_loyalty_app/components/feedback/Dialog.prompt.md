One-line: Modal for confirmations and the PIN step — the only place in the system that uses blur.

```jsx
<Dialog open title="Confirm this visit" onClose={close} footer={<Button>Confirm</Button>}>…</Dialog>
```
