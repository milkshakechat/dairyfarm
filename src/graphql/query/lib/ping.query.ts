export const ping = (_parent: any, args: any, _context: any, _info: any) => ({
  timestamp: `${new Date().toISOString()}`,
});

export const demoPing = (
  _parent: any,
  args: any,
  _context: any,
  _info: any
) => ({ timestamp: `${new Date().toISOString()}` });
