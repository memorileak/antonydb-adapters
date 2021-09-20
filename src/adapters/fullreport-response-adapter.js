const {objUtil} = require('../utils/obj-util.js');
const {reportResponseAdapter} = require('./report-response-adapter.js');

class FullreportResponseAdapter {
  adapt(response) {
    return this.getReportDataFromResponse(response);
  }

  getReportDataFromResponse(response) {
    try {
      const fullReportData = response.hits[0]._source;
      const {
        printers,
        processes,
        softwares,
        networks_adapter,
        security_settings,
        services,
        networks,
        autoruns,
        files,
        event_log,
        hardware,
        ...partialReportData
      } = fullReportData;

      const reportData = {...partialReportData};
      reportData.extended = {
        printers: this.adaptPrinters(printers),
        processes: this.adaptProcesses(processes),
        softwares: this.adaptSoftwares(softwares),
        networks_adapter: this.adaptNetworksAdapter(networks_adapter),
        security_settings: this.adaptSecuritySettings(security_settings),
        services: this.adaptServices(services),
        networks: this.adaptNetworks(networks),
        autoruns: this.adaptAutoruns(autoruns),
        files: this.adaptFiles(files),
        // event_log: this.adaptEventLog(event_log),
        hardware: this.adaptHardware(hardware),
      };

      response.hits[0]._source = reportData;
      return reportResponseAdapter.adapt(response);
    } catch (err) {
      console.error(err);
      return {};
    }
  }

  adaptPrinters(printers) {
    return (printers || [])
      .map((printer) => ({
        name: objUtil.path(['name'])(printer),
        driver_name: objUtil.path(['driver_name'])(printer),
        port_name: objUtil.path(['port_name'])(printer),
        status: objUtil.path(['status'])(printer),
      }));
  }

  adaptProcesses(processes) {
    return (processes || [])
      .map((process) => ({
        pid: objUtil.path(['pid'])(process),
        name: objUtil.path(['name'])(process),
        image: objUtil.path(['image'])(process),
        command_line: objUtil.path(['command_line'])(process),
        signed: objUtil.path(['signed'])(process),
        user_name: objUtil.path(['user_name'])(process),
      }));
  }

  adaptSoftwares(softwares) {
    return (softwares || [])
      .map((software) => ({
        name: objUtil.path(['name'])(software),
        version: objUtil.path(['version'])(software),
        publisher: objUtil.path(['publisher'])(software),
        location: objUtil.path(['location'])(software),
      }))
      .filter((software) => software.name);
  }

  adaptNetworksAdapter(networks_adapter) {
    return (networks_adapter || [])
      .map((adapter) => ({
        Type: objUtil.path(['Type'])(adapter),
        AdapterDesc: objUtil.path(['AdapterDesc'])(adapter),
        Gateway: objUtil.path(['Gateway'])(adapter),
        IPAddress: objUtil.path(['IPAddress'])(adapter),
        MAC: objUtil.path(['MAC'])(adapter),
      }));
  }

  adaptSecuritySettings(security_settings) {
    return {
      firewall: objUtil.path(['firewall'])(security_settings),
      av_installed: objUtil.path(['av_installed'])(security_settings),
      UAC_level: objUtil.path(['UAC_level'])(security_settings),
    };
  }

  adaptServices(services) {
    return (services || [])
      .map((service) => ({
        name: objUtil.path(['name'])(service),
        service_type: objUtil.path(['service_type'])(service),
        start_type: objUtil.path(['start_type'])(service),
        image: objUtil.path(['image'])(service),
        signed: objUtil.path(['signed'])(service),
        tag_id: objUtil.path(['tag_id'])(service),
      }));
  }

  adaptNetworks(networks) {
    return {
      dns_cache: objUtil.path(['dns_cache'])(networks) || [],
      netstat: (objUtil.path(['netstat'])(networks) || [])
        .map((stat) => ({
          pid: objUtil.path(['pid'])(stat),
          state: objUtil.path(['state'])(stat),
          local: objUtil.path(['local'])(stat),
          local_port: objUtil.path(['local_port'])(stat),
          remote: objUtil.path(['remote'])(stat),
          remote_port: objUtil.path(['remote_port'])(stat),
        })),
    };
  }

  adaptAutoruns(autoruns) {
    return (autoruns || [])
      .map((autorun) => ({
        name: objUtil.path(['name'])(autorun),
        caption: objUtil.path(['caption'])(autorun),
        location: objUtil.path(['location'])(autorun),
        command: objUtil.path(['command'])(autorun),
        user: objUtil.path(['user'])(autorun),
        signed: objUtil.path(['signed'])(autorun),
      }));
  }

  adaptFiles(files) {
    return (files || [])
      .map((file) => ({
        image: objUtil.path(['image'])(file),
        sha256: objUtil.path(['sha256'])(file),
        signed: objUtil.path(['signed'])(file),
      }));
  }

  adaptEventLog() {
    // Event log is too long
    return [];
  }

  adaptHardware(hardware) {
    return {
      main_board: (objUtil.path(['main_board'])(hardware) || [])
        .map((board) => ({
          product: objUtil.path(['product'])(board),
          caption: objUtil.path(['caption'])(board),
          description: objUtil.path(['description'])(board),
          model: objUtil.path(['model'])(board),
          serial_number: objUtil.path(['serial_number'])(board),
          version: objUtil.path(['version'])(board),
          manufacturer: objUtil.path(['manufacturer'])(board),
        })),
      bios: (objUtil.path(['bios'])(hardware) || [])
        .map((aBios) => ({
          description: objUtil.path(['description'])(aBios),
          manufacturer: objUtil.path(['manufacturer'])(aBios),
          name: objUtil.path(['name'])(aBios),
          release_date: objUtil.path(['release_date'])(aBios),
          smbbios_version: objUtil.path(['smbbios_version'])(aBios),
          version: objUtil.path(['version'])(aBios),
        })),
      cpus: (objUtil.path(['cpus'])(hardware) || [])
        .map((cpu) => ({
          architecture: objUtil.path(['architecture'])(cpu),
          caption: objUtil.path(['caption'])(cpu),
          code_name: objUtil.path(['code_name'])(cpu),
          device_id: objUtil.path(['device_id'])(cpu),
          L2cache_size: objUtil.path(['L2cache_size'])(cpu),
          L2cache_speed: objUtil.path(['L2cache_speed'])(cpu),
          L3cache_size: objUtil.path(['L3cache_size'])(cpu),
          L3cache_speed: objUtil.path(['L3cache_speed'])(cpu),
          manufacturer: objUtil.path(['manufacturer'])(cpu),
          max_clock_speed: objUtil.path(['max_clock_speed'])(cpu),
          name: objUtil.path(['name'])(cpu),
          number_of_cores: objUtil.path(['number_of_cores'])(cpu),
          number_of_enable_cores: objUtil.path(['number_of_enable_cores'])(cpu),
          number_of_logical_processors: objUtil.path(['number_of_logical_processors'])(cpu),
          processor_id: objUtil.path(['processor_id'])(cpu),
          revision: objUtil.path(['revision'])(cpu),
          serial_number: objUtil.path(['serial_number'])(cpu),
          soket_designation: objUtil.path(['soket_designation'])(cpu),
          status: objUtil.path(['status'])(cpu),
          thread_count: objUtil.path(['thread_count'])(cpu),
        })),
      memories: (objUtil.path(['memories'])(hardware) || [])
        .map((mem) => ({
          bus: objUtil.path(['bus'])(mem),
          caption: objUtil.path(['caption'])(mem),
          configure_clock_speed: objUtil.path(['configure_clock_speed'])(mem),
          configure_voltage: objUtil.path(['configure_voltage'])(mem),
          data_width: objUtil.path(['data_width'])(mem),
          description: objUtil.path(['description'])(mem),
          device_locator: objUtil.path(['device_locator'])(mem),
          manufacturer: objUtil.path(['manufacturer'])(mem),
          memory_type: objUtil.path(['memory_type'])(mem),
          part_number: objUtil.path(['part_number'])(mem),
          serial_number: objUtil.path(['serial_number'])(mem),
          size: objUtil.path(['size'])(mem),
        })),
      graphics: (objUtil.path(['graphics'])(hardware) || [])
        .map((gpu) => ({
          adapter_compatibility: objUtil.path(['adapter_compatibility'])(gpu),
          adapter_RAM: objUtil.path(['adapter_RAM'])(gpu),
          caption: objUtil.path(['caption'])(gpu),
          driver_date: objUtil.path(['driver_date'])(gpu),
          driver_version: objUtil.path(['driver_version'])(gpu),
          inf_section: objUtil.path(['inf_section'])(gpu),
          manufacturer: objUtil.path(['manufacturer'])(gpu),
          name: objUtil.path(['name'])(gpu),
          PNP_device_id: objUtil.path(['PNP_device_id'])(gpu),
          status: objUtil.path(['status'])(gpu),
          video_mode_description: objUtil.path(['video_mode_description'])(gpu),
          video_processor: objUtil.path(['video_processor'])(gpu),
        })),
      storage: {
        physical: (objUtil.path(['storage', 'physical'])(hardware) || [])
          .map((storage) => ({
            caption: objUtil.path(['caption'])(storage),
            firmware_revision: objUtil.path(['firmware_revision'])(storage),
            interface_type: objUtil.path(['interface_type'])(storage),
            manufacturer: objUtil.path(['manufacturer'])(storage),
            media_type: objUtil.path(['media_type'])(storage),
            model: objUtil.path(['model'])(storage),
            name: objUtil.path(['name'])(storage),
            pnp_device_id: objUtil.path(['pnp_device_id'])(storage),
            scsi_bus: objUtil.path(['scsi_bus'])(storage),
            scsi_logical_init: objUtil.path(['scsi_logical_init'])(storage),
            scsi_port: objUtil.path(['scsi_port'])(storage),
            scsi_target_id: objUtil.path(['scsi_target_id'])(storage),
            sectors_per_track: objUtil.path(['sectors_per_track'])(storage),
            serial_number: objUtil.path(['serial_number'])(storage),
            size: objUtil.path(['size'])(storage),
            total_cylinders: objUtil.path(['total_cylinders'])(storage),
            total_heads: objUtil.path(['total_heads'])(storage),
            total_sectors: objUtil.path(['total_sectors'])(storage),
            total_track: objUtil.path(['total_track'])(storage),
            tracks_per_cylinder: objUtil.path(['tracks_per_cylinder'])(storage),
          })),
        logical: (objUtil.path(['storage', 'logical'])(hardware) || [])
          .map((storage) => ({
            caption: objUtil.path(['caption'])(storage),
            device_id: objUtil.path(['device_id'])(storage),
            driver: objUtil.path(['driver'])(storage),
            file_system: objUtil.path(['file_system'])(storage),
            free_space: objUtil.path(['free_space'])(storage),
            label: objUtil.path(['label'])(storage),
            serial_number: objUtil.path(['serial_number'])(storage),
            size: objUtil.path(['size'])(storage),
          })),
      },
      pcis: (objUtil.path(['pcis'])(hardware) || [])
        .map((pci) => ({
          caption: objUtil.path(['caption'])(pci),
          description: objUtil.path(['description'])(pci),
          manufacturer: objUtil.path(['manufacturer'])(pci),
          device_id: objUtil.path(['device_id'])(pci),
          name: objUtil.path(['name'])(pci),
        })),
      usbs: (objUtil.path(['usbs'])(hardware) || [])
        .map((usb) => ({
          caption: objUtil.path(['caption'])(usb),
          description: objUtil.path(['description'])(usb),
          manufacturer: objUtil.path(['manufacturer'])(usb),
          device_id: objUtil.path(['device_id'])(usb),
          name: objUtil.path(['name'])(usb),
        })),
    };
  }
}

const fullreportResponseAdapter = new FullreportResponseAdapter();
module.exports = {fullreportResponseAdapter};
