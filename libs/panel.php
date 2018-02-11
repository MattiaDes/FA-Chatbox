<?php
    Class Panel extends FA {
        public $panel;
        protected $_config;
        
        public function __construct(array $config) {
            $this->panel = $panel;
            $this->_config = $config;
        }
        
        public function __destruct() {
            $this->_config = null;
        }
        
        public function createPanel() {
            
        }
    }
?>
