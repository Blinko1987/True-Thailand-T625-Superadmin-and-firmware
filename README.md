# True Thailand T625 Superadmin and Firmware

Firmware dump + superadmin access details for True Online T625pro GPON ONT.

## Superadmin Credentials

- **Web Superadmin**  
  Username: superadmin  
  Password: t4246#5753S@dM1n

- **Console / Telnet**  
  Username: superadmin  
  Password: t4246#5753

## Recover Superadmin Password (if changed/wrong)

1. Telnet/Console in with superadmin credentials  
2. Run:
   ```
   cd /ptrom/ptconf
   cat param_ct.xml | grep -i TeleComAccount_Password
   ```
3. Password value appears in XML → use to regain web access



## Important Notes

- With superadmin web access:  
Enable Telnet under **Firewall → Remote Access**  
- Most sensitive configs stored in `/ptrom/ptconf/param_ct.xml`  
- Full firmware extracted from device (bin, etc, lib, userfs, www, etc.)

Use responsibly. For educational/research purposes only.
