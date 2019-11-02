local moduleName = ... 
local M = {}
_G[moduleName] = M

function M.Start() 
	local P, T = bme280.baro()
	local bar = string.format("%d.%02d", P/1000, P%1000)
	local Tsgn = (T < 0 and -1 or 1); T = Tsgn*T
	local temp= string.format("%s%d.%02d", Tsgn<0 and "-" or "", T/100, T%100)	
	local H, T = bme280.humi()
	local humi =string.format("%d.%02d", H/1000, H%1000)
	local D = bme280.dewpoint(H, T)
	local Dsgn = (D < 0 and -1 or 1); D = Dsgn*D
	local dew=string.format("%s%d.%02d", Dsgn<0 and "-" or "", D/100, D%100)
	local ad = 1023 - adc.read(0)
	--print(bar,temp,humi,dew)
	local json = '{"temp":'..temp..',"dew":'..dew..',"bar":'..bar..',"humi":'..humi..',"adc":'..ad..'}'
	return json
end

return M
