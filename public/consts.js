export const getResponse = async (data) => data.ok?new Response(data.body).json():false
export const pfpOrDefault = (pfp) => pfp?pfp:"/blank-pfp.png"